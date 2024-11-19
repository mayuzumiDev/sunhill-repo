from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import AssessmentCategory, Question, StudentAssessment, AssessmentResponse
from .serializers import (
    CategorySerializer,
    QuestionSerializer,
    AssessmentSerializer,
    ResponseSerializer
)
import random

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

class RandomQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            category_id = request.query_params.get('category')
            count = int(request.query_params.get('count', 10))
            
            if not category_id:
                return Response(
                    {'error': 'Category ID is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            questions = list(Question.objects.filter(category_id=category_id))
            if not questions:
                return Response(
                    {'error': 'No questions found for this category'}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            selected_questions = random.sample(questions, min(count, len(questions)))
            serializer = QuestionSerializer(selected_questions, many=True)
            
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

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
                
                # Check for existing assessments
                existing_assessment = StudentAssessment.objects.filter(
                    student=student_info,
                    category_id=data['category']
                ).order_by('-created_at').first()
                
                if existing_assessment:
                    if not existing_assessment.completed:
                        # Return the existing incomplete assessment
                        serializer = self.get_serializer(existing_assessment)
                        return Response(
                            {
                                'message': 'Found an incomplete assessment',
                                'assessment': serializer.data
                            }, 
                            status=status.HTTP_200_OK
                        )
                    else:
                        # Previous assessment is completed, allow creating a new one
                        pass
                
                serializer = self.get_serializer(data=data)
                if not serializer.is_valid():
                    print('Validation Errors:', serializer.errors)
                    return Response(
                        {'message': 'Invalid data provided', 'errors': serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                assessment = serializer.save(assessor=request.user)
                return Response(
                    {
                        'message': 'Assessment created successfully',
                        'assessment': serializer.data
                    }, 
                    status=status.HTTP_201_CREATED
                )
                
            except (UserInfo.DoesNotExist, StudentInfo.DoesNotExist) as e:
                print('Error finding student:', str(e))
                return Response(
                    {'message': 'Student not found', 'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
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
            return Response(serializer.data)
        except Exception as e:
            print('Error during assessment update:', str(e))
            return Response(
                {'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class AssessmentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AssessmentSerializer

    def get_queryset(self):
        student_id = self.request.query_params.get('student', None)
        if student_id:
            return StudentAssessment.objects.filter(student_id=student_id)
        return StudentAssessment.objects.all()

class ResponseBulkCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            responses_data = request.data.get('responses', [])
            created_responses = []

            for response_data in responses_data:
                serializer = ResponseSerializer(data=response_data)
                if serializer.is_valid():
                    serializer.save()
                    created_responses.append(serializer.data)
                else:
                    # Log the validation errors
                    print('Response validation errors:', serializer.errors)
                    return Response(
                        serializer.errors, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

            return Response(
                {'message': 'Responses created successfully', 'responses': created_responses},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            # Log the error for debugging
            print('Error during bulk response creation:', str(e))
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
