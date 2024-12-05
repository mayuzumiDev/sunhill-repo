from rest_framework import serializers
from user_teacher.models.quizzes_models import Question, Choice

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'image', 'question_type', 'correct_answer', 'choices']

    def validate(self, data):
        """
        Custom validation for different question types
        """
        question_type = data.get('question_type')
        correct_answer = data.get('correct_answer')

        if question_type == 'true_false':
            # Ensure correct_answer is provided for true/false questions
            if correct_answer is None:
                data['correct_answer'] = 'false'  # Default to false if not provided
            else:
                # Normalize the boolean answer to string
                data['correct_answer'] = str(correct_answer).lower()
        elif question_type == 'identification':
            # Ensure correct_answer is provided for identification questions
            if not correct_answer:
                raise serializers.ValidationError({"correct_answer": "Correct answer is required for identification questions"})
            # Store answer in correct_answer field
            data['correct_answer'] = str(correct_answer).strip().upper()

        return data

        return data