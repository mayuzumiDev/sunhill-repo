from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, generics
from django.shortcuts import get_object_or_404
from user_teacher.models.quizzes_models import Quiz, Question
from user_student.serializers.quizzes.quiz_serializers import QuestionSerializer

class StudentQuizQuestionsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer
    
    def get_queryset(self):
        quiz_id = self.kwargs.get('quiz_id')
        quiz = get_object_or_404(Quiz, id=quiz_id)
        return Question.objects.filter(quiz=quiz)
    
    def list(self, request, *args, **kwargs):
        quiz_id = self.kwargs.get('quiz_id')
        quiz = get_object_or_404(Quiz, id=quiz_id)
        
        # Get the questions using the get_queryset method
        questions = self.get_queryset()
        serializer = self.get_serializer(questions, many=True)
        
        return Response({
            'quiz_title': quiz.title,
            'quiz_description': quiz.description,
            'due_date': quiz.due_date,
            'questions': serializer.data
        }, status=status.HTTP_200_OK)