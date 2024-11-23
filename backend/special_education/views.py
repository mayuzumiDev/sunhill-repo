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

class CategoryListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AssessmentCategory.objects.all()
    serializer_class = CategorySerializer

class QuestionListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_queryset(self):
        category_id = self.request.query_params.get('category', None)
        if category_id:
            return Question.objects.filter(category_id=category_id)
        return Question.objects.all()

class AutoAssessmentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
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
                'category': CategorySerializer(selected_category).data,
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
            print('Assessment Update Request Data:', request.data)
            instance = self.get_object()
            
            # Only allow updating the completed field
            data = {'completed': request.data.get('completed', instance.completed)}
            
            serializer = self.get_serializer(instance, data=data, partial=True)
            if not serializer.is_valid():
                print('Validation Errors:', serializer.errors)
                return Response(
                    {'message': 'Invalid data provided', 'errors': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            self.perform_update(serializer)
            
            # Calculate assessment results and return with completion info
            assessment_data = serializer.data
            if instance.completed:
                category_scores = instance.calculate_category_scores()
                assessment_data.update({
                    'category_scores': category_scores,
                    'assessment_number': instance.assessment_number,
                    'days_remaining': 30,
                    'results_available_date': instance.results_available_date.isoformat() if instance.results_available_date else None,
                    'message': f'Assessment {instance.assessment_number}/30 completed. Continue assessing for more accurate results.'
                })
            
            return Response(assessment_data)
        except Exception as e:
            print('Error during assessment update:', str(e))
            return Response(
                {'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

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

            # Serialize and return the questions
            serializer = QuestionSerializer(selected_questions, many=True)
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
            # Get all completed assessments for the student
            assessments = StudentAssessment.objects.filter(
                student_id=student_id,
                completed=True
            ).order_by('-date')

            total_assessments = assessments.count()

            if total_assessments == 0:
                return Response({
                    'total_assessments': 0,
                    'category_percentages': {},
                    'latest_assessment': None
                })

            # Get the latest assessment
            latest_assessment = assessments.first()

            # Calculate category percentages
            responses = AssessmentResponse.objects.filter(assessment__in=assessments)
            category_scores = defaultdict(list)

            for response in responses:
                category = response.question.category.title
                # Convert response to numeric value
                value_map = {
                    'never': 0,
                    'sometimes': 1,
                    'often': 2,
                    'very_often': 3
                }
                category_scores[category].append(value_map.get(response.response.lower(), 0))

            # Calculate percentage for each category
            category_percentages = {}
            for category, scores in category_scores.items():
                if scores:
                    # Calculate percentage (max score would be 3 * number of questions)
                    max_possible = 3 * len(scores)
                    actual_sum = sum(scores)
                    percentage = (actual_sum / max_possible) * 100
                    category_percentages[category] = round(percentage, 1)

            return Response({
                'total_assessments': total_assessments,
                'category_percentages': category_percentages,
                'latest_assessment': AssessmentSerializer(latest_assessment).data if latest_assessment else None
            })

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
