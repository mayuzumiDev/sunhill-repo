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
        try:
            # Validate quiz ID
            quiz_id = request.data.get('quiz')
            if not quiz_id:
                raise serializers.ValidationError({"quiz": "Quiz ID is required"})
                
            # Create question
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            question = serializer.save()
        
            # Handle different question types
            question_type = question.question_type
            
            if question_type == 'true_false':
                # Handle true/false questions
                correct_answer = str(request.data.get('correct_answer', 'false')).lower()
                question.correct_answer = correct_answer
                question.save()
                
                # Create True and False choices
                Choice.objects.create(
                    question=question,
                    text='true',
                    is_correct=(correct_answer == 'true')
                )
                Choice.objects.create(
                    question=question,
                    text='false',
                    is_correct=(correct_answer == 'false')
                )
                
            elif question_type == 'identification':
                # Handle identification questions
                correct_answer = request.data.get('correct_answer')
                if correct_answer:
                    # Store the answer in both question and choice model for consistency
                    question.correct_answer = str(correct_answer).strip()
                    question.save()
                    
                    # Create a choice object with the correct answer
                    Choice.objects.create(
                        question=question,
                        text=str(correct_answer).strip(),
                        is_correct=True
                    )
                else:
                    raise serializers.ValidationError({"correct_answer": "Correct answer is required for identification questions"})
                
            elif question_type in ['single', 'multi']:
                # Handle single and multiple choice questions
                choices_data = request.data.get('choices', [])
                if not choices_data:
                    raise serializers.ValidationError({"choices": "Choices are required for single/multiple choice questions"})
                
                # Validate that at least one choice is marked as correct
                has_correct_choice = any(choice.get('is_correct', False) for choice in choices_data)
                if not has_correct_choice:
                    raise serializers.ValidationError({"choices": "At least one choice must be marked as correct"})
                
                # Create choices
                for choice_data in choices_data:
                    Choice.objects.create(
                        question=question,
                        text=choice_data.get('text', '').strip(),
                        is_correct=choice_data.get('is_correct', False)
                    )

            # Return the updated question data
            updated_serializer = self.get_serializer(question)
            return Response(
                {
                    "message": "Question created successfully.",
                    "question": updated_serializer.data
                },
                status=status.HTTP_201_CREATED
            )
            
        except serializers.ValidationError as e:
            return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
            correct_answer = str(request.data.get('correct_answer', 'false')).lower()
            question.correct_answer = correct_answer
            question.save()
            
            # Clear any existing choices
            question.choices.all().delete()
            
            # Create True and False choices
            Choice.objects.create(
                question=question,
                text='true',
                is_correct=(correct_answer == 'true')
            )
            Choice.objects.create(
                question=question,
                text='false',
                is_correct=(correct_answer == 'false')
            )
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