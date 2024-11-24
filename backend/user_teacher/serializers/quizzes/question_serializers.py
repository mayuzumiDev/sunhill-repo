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