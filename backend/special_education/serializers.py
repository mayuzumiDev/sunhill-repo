from rest_framework import serializers
from .models import AssessmentCategory, Question, StudentAssessment, AssessmentResponse
from user_admin.serializers.accounts.list_account_serializers import StudentListSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentCategory
        fields = ['id', 'title', 'description', 'created_at', 'updated_at']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'category', 'question_text', 'question_category', 'created_at', 'updated_at']

class ResponseSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    question_category = serializers.CharField(source='question.question_category', read_only=True)

    class Meta:
        model = AssessmentResponse
        fields = ['id', 'assessment', 'question', 'question_text', 'question_category', 'response', 'created_at', 'updated_at']

    def validate(self, data):
        """
        Check that the question belongs to the assessment's category
        """
        assessment = data.get('assessment')
        question = data.get('question')
        
        if assessment and question and question.category != assessment.category:
            raise serializers.ValidationError(
                "Question does not belong to the assessment category"
            )
        return data

class AssessmentSerializer(serializers.ModelSerializer):
    student_details = StudentListSerializer(source='student.student_info.user', read_only=True)
    category_details = CategorySerializer(source='category', read_only=True)
    responses = ResponseSerializer(many=True, read_only=True, source='assessmentresponse_set')

    class Meta:
        model = StudentAssessment
        fields = ['id', 'student', 'student_details', 'category', 'category_details', 
                 'assessor', 'date', 'completed', 'responses', 'created_at', 'updated_at']
        read_only_fields = ['assessor', 'date']

    def validate(self, data):
        # Only validate required fields for creation, not for updates
        if self.instance is None:  # This is a creation
            if not data.get('student'):
                raise serializers.ValidationError({'student': 'Student field is required'})
            if not data.get('category'):
                raise serializers.ValidationError({'category': 'Category field is required'})
        return data
