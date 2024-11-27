from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import datetime, timedelta
from .models import AssessmentCategory, Question, StudentAssessment, AssessmentResponse
from .serializers import (
    CategorySerializer,
    QuestionSerializer,
    AssessmentSerializer,
    ResponseSerializer
)
import random
from rest_framework import status
from django.db.models import Count, Avg
from collections import defaultdict
from django.http import JsonResponse

class CategoryListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AssessmentCategory.objects.all()
    serializer_class = CategorySerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language'] = self.request.query_params.get('language', 'en')
        return context

class QuestionListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_queryset(self):
        category_id = self.request.query_params.get('category', None)
        if category_id:
            return Question.objects.filter(category_id=category_id)
        return Question.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language'] = self.request.query_params.get('language', 'en')
        return context

class AutoAssessmentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            language = request.query_params.get('language', 'en')
            # Get all active categories and randomly select one
            categories = AssessmentCategory.objects.filter(is_active=True)
            if not categories:
                return Response(
                    {'error': 'No active assessment categories available'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            selected_category = random.choice(categories)
            
            # Get 10 random questions from the selected category
            questions = list(Question.objects.filter(
                category=selected_category,
                is_active=True
            ))
            
            if len(questions) < 10:
                return Response(
                    {'error': 'Insufficient questions in selected category'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            random_questions = random.sample(questions, 10)
            
            return Response({
                'category': CategorySerializer(selected_category, context={'language': language}).data,
                'questions': QuestionSerializer(random_questions, many=True).data
            })
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AssessmentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AssessmentSerializer

    def get_queryset(self):
        student_id = self.request.query_params.get('student')
        queryset = StudentAssessment.objects.all()
        
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        
        return queryset.order_by('-date')

class AssessmentCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AssessmentSerializer
    queryset = StudentAssessment.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            print('Assessment Creation Request Data:', request.data)
            
            # Get the StudentInfo instance based on the user ID
            from user_admin.models.account_models import UserInfo, StudentInfo
            try:
                user_info = UserInfo.objects.get(user_id=request.data.get('student'))
                student_info = StudentInfo.objects.get(student_info=user_info)
                
                # Update request data with correct student_info ID
                data = request.data.copy()
                data['student'] = student_info.id
                data['assessor'] = request.user.id
                
                # Check for existing assessments
                existing_assessment = StudentAssessment.objects.filter(
                    student=student_info,
                    category_id=data['category']
                ).order_by('-date').first()
                
                if existing_assessment and not existing_assessment.completed:
                    # Return the existing incomplete assessment
                    serializer = self.get_serializer(existing_assessment)
                    return Response(
                        {
                            'message': 'Found an incomplete assessment',
                            'assessment': serializer.data
                        },
                        status=status.HTTP_200_OK
                    )
                
                # Create new assessment
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                assessment = serializer.save()
                
                # Get the assessment count for this student
                completed_count = StudentAssessment.objects.filter(
                    student=student_info,
                    completed=True
                ).count()
                
                headers = self.get_success_headers(serializer.data)
                return Response(
                    {
                        'message': f'Assessment created successfully. This will be assessment {completed_count + 1}/30.',
                        'assessment': serializer.data
                    },
                    status=status.HTTP_201_CREATED,
                    headers=headers
                )
                
            except (UserInfo.DoesNotExist, StudentInfo.DoesNotExist) as e:
                return Response(
                    {'message': 'Student not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
                
        except Exception as e:
            print('Error during assessment creation:', str(e))
            return Response(
                {'message': f'Error creating assessment: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class AssessmentUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AssessmentSerializer
    queryset = StudentAssessment.objects.all()

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            
            # Update completion status
            instance.completed = request.data.get('completed', instance.completed)
            instance.save()

            # Get all completed assessments for this student
            completed_assessments = StudentAssessment.objects.filter(
                student=instance.student,
                completed=True
            ).order_by('date')
            
            completed_count = completed_assessments.count()

            # Calculate cumulative scores
            cumulative_scores = defaultdict(list)
            for assessment in completed_assessments:
                responses = AssessmentResponse.objects.filter(assessment=assessment)
                for response in responses:
                    score = self.calculate_response_score(response.response)
                    cumulative_scores[response.question.question_category].append(score)

            # Calculate average scores
            final_scores = {
                category: (sum(scores) / len(scores)) * (100/3)
                for category, scores in cumulative_scores.items()
            }

            response_data = {
                'message': f'Assessment {completed_count}/30 completed successfully',
                'assessment_number': completed_count,
                'category_scores': final_scores,
                'assessment': AssessmentSerializer(instance).data
            }

            # Add completion analysis for 30th assessment
            if completed_count == 30:
                response_data.update({
                    'message': 'Congratulations! All 30 assessments completed!',
                    'completion_analysis': True,
                    'diagnosis_results': self.calculate_diagnosis_probabilities(final_scores)
                })

            return Response(response_data)

        except Exception as e:
            print(f"Error updating assessment: {str(e)}")  # Debug log
            return Response(
                {'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def calculate_response_score(self, response):
        score_mapping = {
            'never': 0,
            'sometimes': 1,
            'often': 2,
            'very_often': 3
        }
        return score_mapping.get(response.lower(), 0)

    def calculate_diagnosis_probabilities(self, category_scores):
        diagnosis_criteria = {
            'ASD': {
                'categories': ['Social', 'Behavioral', 'Communication'],
                'threshold': 70
            },
            'ADHD': {
                'categories': ['Attention', 'Hyperactivity', 'Impulsivity'],
                'threshold': 65
            },
            'Learning Disability': {
                'categories': ['Academic', 'Cognitive', 'Processing'],
                'threshold': 60
            }
        }

        results = {}
        for diagnosis, criteria in diagnosis_criteria.items():
            relevant_scores = [
                category_scores.get(cat, 0)
                for cat in criteria['categories']
            ]
            if relevant_scores:
                avg_score = sum(relevant_scores) / len(relevant_scores)
                probability = (avg_score / criteria['threshold']) * 100
                results[diagnosis] = {
                    'probability': min(probability, 100),
                    'threshold_met': avg_score >= criteria['threshold']
                }

        return results

class AssessmentDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AssessmentSerializer
    queryset = StudentAssessment.objects.all()

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            data = serializer.data

            # Get all responses for this assessment
            responses = AssessmentResponse.objects.filter(assessment=instance)
            response_data = ResponseSerializer(responses, many=True).data

            # Add responses to the data
            data['responses'] = response_data

            # Calculate category scores if assessment is completed
            if instance.completed:
                data['category_scores'] = instance.calculate_category_scores()

            return Response(data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AssessmentDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = StudentAssessment.objects.all()
    serializer_class = AssessmentSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response({'message': 'Assessment deleted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ResponseBulkCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            print('Received response data:', request.data)
            responses_data = request.data.get('responses', [])
            if not responses_data:
                return Response(
                    {'error': 'No responses provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            created_responses = []
            errors = []

            for response_data in responses_data:
                print('Processing response:', response_data)
                serializer = ResponseSerializer(data=response_data)
                if serializer.is_valid():
                    try:
                        response = serializer.save()
                        created_responses.append(ResponseSerializer(response).data)
                    except Exception as e:
                        print('Error saving response:', str(e))
                        errors.append({
                            'data': response_data,
                            'error': str(e)
                        })
                else:
                    print('Validation errors:', serializer.errors)
                    errors.append({
                        'data': response_data,
                        'error': serializer.errors
                    })

            if errors:
                print('Errors during bulk create:', errors)
                return Response(
                    {
                        'error': 'Some responses failed to save',
                        'details': errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                {
                    'message': 'Responses saved successfully',
                    'responses': created_responses
                },
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            print('Unexpected error:', str(e))
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RandomQuestionView(APIView):
    """View to get random questions for public assessment."""
    permission_classes = []  # Public access

    def get(self, request):
        try:
            category_id = request.query_params.get('category')
            count = int(request.query_params.get('count', 10))
            language = request.query_params.get('language', 'en')  # Get language parameter

            if not category_id:
                return Response(
                    {'error': 'Category ID is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get questions for the specified category
            questions = Question.objects.filter(category_id=category_id)
            
            if not questions.exists():
                return Response(
                    {'error': 'No questions found for this category'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Randomly select the specified number of questions
            selected_questions = random.sample(
                list(questions),
                min(count, len(questions))
            )

            # Serialize and return the questions with language context
            serializer = QuestionSerializer(
                selected_questions, 
                many=True,
                context={'language': language}  # Add language to serializer context
            )
            return Response(serializer.data)

        except ValueError:
            return Response(
                {'error': 'Invalid count parameter'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AssessmentAnalysisView(APIView):
    def get(self, request, student_id):
        try:
            print(f"Analyzing assessments for student ID: {student_id}")  # Debug log

            # Get all completed assessments for the student
            assessments = StudentAssessment.objects.filter(
                student_id=student_id,
                completed=True
            ).order_by('date')

            total_assessments = assessments.count()
            print(f"Found {total_assessments} completed assessments")  # Debug log

            if total_assessments == 0:
                return Response({
                    'error': 'No completed assessments found for this student'
                }, status=status.HTTP_404_NOT_FOUND)

            # Initialize data structures
            all_responses = []
            category_totals = defaultdict(lambda: {'total': 0, 'count': 0})
            assessment_timeline = []

            # Process each assessment
            for assessment in assessments:
                # Get responses directly without using prefetch_related
                responses = AssessmentResponse.objects.filter(assessment=assessment).select_related('question')
                assessment_scores = defaultdict(list)

                for response in responses:
                    category = response.question.question_category
                    score = self.calculate_response_score(response.response)
                    
                    # Add to category totals
                    category_totals[category]['total'] += score
                    category_totals[category]['count'] += 1
                    
                    # Add to assessment scores
                    assessment_scores[category].append(score)
                    
                    # Add to all responses
                    all_responses.append({
                        'category': category,
                        'score': score,
                        'assessment_number': assessment.assessment_number
                    })

                # Calculate average scores for this assessment
                assessment_averages = {
                    category: (sum(scores) / len(scores)) * (100/3)  # Normalize to percentage
                    for category, scores in assessment_scores.items()
                    if scores  # Only include categories with scores
                }

                # Add to timeline
                assessment_timeline.append({
                    'id': assessment.id,
                    'date': assessment.date,
                    'assessment_number': assessment.assessment_number,
                    'scores': assessment_averages
                })

            # Calculate overall category percentages
            category_percentages = {}
            for category, data in category_totals.items():
                if data['count'] > 0:  # Prevent division by zero
                    category_percentages[category] = (data['total'] / data['count']) * (100/3)  # Normalize to percentage

            # Find dominant category
            if category_percentages:
                dominant_category = max(category_percentages.items(), key=lambda x: x[1])[0]
            else:
                dominant_category = None

            # Calculate progress trends
            progress_trend = defaultdict(list)
            for response in all_responses:
                progress_trend[response['category']].append({
                    'assessment_number': response['assessment_number'],
                    'score': response['score'] * (100/3)  # Normalize to percentage
                })

            # Calculate diagnosis thresholds
            diagnosis_results = {}
            diagnosis_criteria = {
                'ASD': {
                    'categories': ['Social', 'Behavioral', 'Communication'],
                    'threshold': 70
                },
                'ADHD': {
                    'categories': ['Attention', 'Hyperactivity', 'Impulsivity'],
                    'threshold': 65
                },
                'Learning Disability': {
                    'categories': ['Academic', 'Cognitive', 'Processing'],
                    'threshold': 60
                }
            }

            # Calculate diagnosis probabilities
            for diagnosis, criteria in diagnosis_criteria.items():
                relevant_scores = [
                    category_percentages[cat] 
                    for cat in criteria['categories'] 
                    if cat in category_percentages
                ]
                if relevant_scores:
                    avg_score = sum(relevant_scores) / len(relevant_scores)
                    probability = (avg_score / criteria['threshold']) * 100
                    diagnosis_results[diagnosis] = {
                        'probability': min(probability, 100),
                        'relevant_categories': relevant_scores,
                        'threshold_met': avg_score >= criteria['threshold']
                    }

            response_data = {
                'total_assessments': total_assessments,
                'category_percentages': category_percentages,
                'dominant_category': dominant_category,
                'assessment_timeline': assessment_timeline,
                'progress_trend': dict(progress_trend),
                'latest_assessment': assessments.last().id if assessments else None,
                'completion_status': 'completed' if total_assessments >= 30 else 'in_progress',
                'completion_percentage': (total_assessments / 30) * 100,
                'diagnosis_results': diagnosis_results,
                'detailed_responses': [
                    {
                        'assessment_number': assessment.assessment_number,
                        'date': assessment.date,
                        'responses': [
                            {
                                'question': response.question.question_text,
                                'category': response.question.question_category,
                                'response': response.response,
                                'score': self.calculate_response_score(response.response)
                            }
                            for response in AssessmentResponse.objects.filter(assessment=assessment)
                        ]
                    }
                    for assessment in assessments
                ]
            }

            print("Analysis response data:", response_data)  # Debug log
            return Response(response_data)

        except Exception as e:
            print(f"Error in assessment analysis: {str(e)}")  # Debug log
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def calculate_response_score(self, response):
        score_mapping = {
            'never': 0,
            'sometimes': 1,
            'often': 2,
            'very_often': 3
        }
        return score_mapping.get(response.lower(), 0)

def get_student_analysis(request, student_id):
    try:
        analysis = StudentAssessment.get_completion_analysis(student_id)
        if not analysis:
            return JsonResponse({'error': 'No completed assessments found'}, status=404)
        
        return JsonResponse(analysis)
    except Exception as e:
        print(f"Error in assessment analysis: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

def update_assessment(request, assessment_id):
    try:
        assessment = StudentAssessment.objects.get(id=assessment_id)
        assessment.completed = True
        assessment.save()

        # Get category scores for this assessment
        category_scores = assessment.calculate_category_scores()

        # Check if this is the 30th assessment
        completed_count = StudentAssessment.objects.filter(
            student=assessment.student,
            completed=True
        ).count()

        response_data = {
            'success': True,
            'assessment_number': completed_count,
            'category_scores': category_scores,
        }

        # If this is the 30th assessment, include the full analysis
        if completed_count == 30:
            full_analysis = StudentAssessment.get_completion_analysis(assessment.student.id)
            response_data['completion_analysis'] = full_analysis
            response_data['message'] = "Congratulations! You have completed all 30 assessments."

        return JsonResponse(response_data)

    except StudentAssessment.DoesNotExist:
        return JsonResponse({'error': 'Assessment not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
