from rest_framework import serializers
from .models.quizzes_models import Quiz, StudentResponse

class QuizTimeAnalyticsSerializer(serializers.ModelSerializer):
    submission_count = serializers.IntegerField()
    submission_date = serializers.DateTimeField()
    
    class Meta:
        model = Quiz
        fields = ['title', 'due_date', 'submission_count', 'submission_date']