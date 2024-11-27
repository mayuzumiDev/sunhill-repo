from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from user_teacher.models.quizzes_models import *
from user_teacher.serializers.quizzes.question_serializers import *

class QuestionCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    def create(self, request, *args, **kwargs):
        quiz_id = request.data.get('quiz')
        if not quiz_id:
            raise serializers.ValidationError({"quiz": "Quiz ID is required"})
            
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.save()
        
        # Handle true/false questions
        if question.question_type == 'true_false':
            correct_answer = request.data.get('correct_answer', 'false')
            question.correct_answer = str(correct_answer).lower()
            question.save()
        else:
            # Handle choices if provided
            choices_data = request.data.get('choices', [])
            for choice_data in choices_data:
                Choice.objects.create(
                    question=question,
                    text=choice_data.get('text'),
                    is_correct=choice_data.get('is_correct', False)
                )

        updated_serializer = self.get_serializer(question)
        return Response(
            {
                "message": "Question created successfully.",
                "question": updated_serializer.data
            },
            status=status.HTTP_201_CREATED
        )


class QuestionListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer

    def list(self, request, *args, **kwargs):
        quiz_id = request.query_params.get('quiz')

        if quiz_id:
            questions = Question.objects.filter(quiz_id=quiz_id)
            serializer = self.get_serializer(questions, many=True)
            return Response({
                "message": "Questions retrieved successfully",
                "questions": serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "message": "Quiz ID is required",
            "questions": []
        }, status=status.HTTP_200_OK)


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        question = serializer.save()
        
        # Handle true/false questions
        if question.question_type == 'true_false':
            correct_answer = request.data.get('correct_answer', 'false')
            question.correct_answer = str(correct_answer).lower()
            question.save()
            # Clear any existing choices
            question.choices.all().delete()
        else:
            # Handle choices update if provided
            choices_data = request.data.get('choices')
            if choices_data:
                # Clear existing choices
                question.choices.all().delete()
                # Create new choices
                for choice_data in choices_data:
                    Choice.objects.create(
                        question=question,
                        text=choice_data.get('text'),
                        is_correct=choice_data.get('is_correct', False)
                    )

        # Get updated data with choices
        updated_serializer = self.get_serializer(question)
        return Response({
            "message": "Question updated successfully",
            "question": updated_serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            "message": "Question deleted successfully"
        }, status=status.HTTP_200_OK)