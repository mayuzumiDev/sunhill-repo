from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from ...models.quizzes_models import StudentResponse, QuizScore, Quiz
from ...serializers.quizzes.quiz_response_serializer import *
from user_admin.models.account_models import *

class QuizResponseViewSet(mixins.CreateModelMixin,
                         mixins.RetrieveModelMixin,
                         mixins.ListModelMixin,
                         viewsets.GenericViewSet):
    """
    ViewSet for handling quiz responses and scores.
    
    Endpoints:
    - POST /quiz-responses/ - Submit a new quiz response
    - GET /quiz-responses/ - List user's quiz responses
    - GET /quiz-responses/{id}/ - Get specific response details
    - GET /quiz-responses/{id}/score/ - Get score for specific response
    - GET /quiz-responses/quiz/{quiz_id}/scores/ - Get all scores for a specific quiz
    """
    permission_classes = [IsAuthenticated]
    serializer_class = QuizResponseSerializer
    
    def get_queryset(self):
        """Filter responses based on user role"""

        # # For testing purposes, return all responses if user is not authenticated
        # if not self.request.user.is_authenticated:
        #     return StudentResponse.objects.all()

        user = self.request.user
        if hasattr(user, 'teacher_info'):
            # Teachers can see responses from their classrooms
            return StudentResponse.objects.filter(
                classroom__teacher=user.teacher_info
            )
        else:
            # Students can only see their own responses
            return StudentResponse.objects.filter(
                student=user.student_info
            )
    
    def create(self, request, *args, **kwargs):
        """Submit a new quiz response"""
        quiz_id = request.data.get('quiz')
        quiz = get_object_or_404(Quiz, id=quiz_id)
        
        # # For testing purposes, if user is not authenticated, use the first student
        # if not request.user.is_authenticated:
        #     student = StudentInfo.objects.select_related('student_info__user').first()
        #     if student:
        #         request.user = student.student_info.user
        #     else:
        #         return Response(
        #             {"detail": "No student found for testing"},
        #             status=status.HTTP_400_BAD_REQUEST
        #         )

        # Add context for the serializer
        serializer = self.get_serializer(
            data=request.data,
            context={'request': request, 'quiz': quiz}
        )
        serializer.is_valid(raise_exception=True)
        response = serializer.save()
        
        # Return the score in the response
        return Response({
            'response': QuizResponseSerializer(response).data,
            'score': QuizScoreSerializer(response.score).data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def score(self, request, pk=None):
        """Get score for a specific response"""
        response = self.get_object()
        score = get_object_or_404(QuizScore, student_response=response)
        return Response(QuizScoreSerializer(score).data)
    
    @action(detail=False, methods=['get'], url_path='quiz/(?P<quiz_id>[^/.]+)/scores')
    def quiz_scores(self, request, quiz_id=None):
        """Get all scores for a specific quiz"""
        quiz = get_object_or_404(Quiz, id=quiz_id)
        
        # Filter scores based on user role
        if hasattr(request.user, 'teacher_info'):
            scores = QuizScore.objects.filter(
                quiz=quiz,
                classroom__teacher=request.user.teacher_info
            )
        else:
            scores = QuizScore.objects.filter(
                quiz=quiz,
                student=request.user.student_info
            )
        
        return Response(QuizScoreSerializer(scores, many=True).data)
    
    @action(detail=False, methods=['get'])
    def my_scores(self, request):
        """Get all scores for the current user"""
        if hasattr(request.user, 'student_info'):
            scores = QuizScore.objects.filter(
                student=request.user.student_info
            ).order_by('-created_at')
            return Response(QuizScoreSerializer(scores, many=True).data)
        return Response(
            {"detail": "Only students can view their scores"},
            status=status.HTTP_403_FORBIDDEN
        )