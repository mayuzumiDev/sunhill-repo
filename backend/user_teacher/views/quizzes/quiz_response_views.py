from rest_framework import status, generics
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist

from ...models.quizzes_models import *
from ...serializers.quizzes.quiz_response_serializer import *
from user_admin.models.account_models import *

class QuizResponseCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizResponseSerializer
    
    def get(self, request, *args, **kwargs):
        """Handle GET request"""
        return JsonResponse({"message": "Ready to receive quiz responses"})

    def create(self, request, *args, **kwargs):
        """Submit a new quiz response"""
        try:
            quiz_id = request.data.get('quiz')
            if not quiz_id:
                return JsonResponse(
                    {"error": "Quiz ID is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            quiz = get_object_or_404(Quiz, id=quiz_id)
            
            # Add context for the serializer
            serializer = self.get_serializer(
                data=request.data,
                context={'request': request, 'quiz': quiz}
            )
            
            if not serializer.is_valid():
                return JsonResponse(
                    {"error": "Invalid data", "details": serializer.errors}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            response = serializer.save()
            
            # Return both the response and score data
            return JsonResponse({
                'message': 'Quiz response submitted successfully',
                'data': QuizResponseSerializer(response).data
            }, status=status.HTTP_201_CREATED)
            
        except ObjectDoesNotExist as e:
            return JsonResponse(
                {"error": str(e)}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return JsonResponse(
                {"error": "An unexpected error occurred", "details": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class QuizScoreListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizScoreSerializer
    
    def get_queryset(self):
        teacher_info = self.request.user.user_info.teacher_info
        classroom_id = self.request.query_params.get('classroom')
        quiz_id = self.request.query_params.get('quiz')
        
        if not classroom_id:
            return QuizScore.objects.none()
            
        filters = {
            'quiz__classroom__class_instructor': teacher_info,
            'classroom_id': classroom_id
        }
        
        if quiz_id:
            filters['quiz_id'] = quiz_id
            
        return QuizScore.objects.filter(
            **filters
        ).select_related(
            'student__student_info__user',
            'quiz',
            'classroom'
        ).order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse({
            'status': 'success',
            'message': 'Quiz scores retrieved successfully',
            'quiz_scores': serializer.data
        }, status=status.HTTP_200_OK)