from rest_framework import serializers
from .models import AssessmentCategory, Question, StudentAssessment, AssessmentResponse
from user_admin.serializers.accounts.list_account_serializers import StudentListSerializer
from django.utils import timezone
from datetime import timedelta

class CategorySerializer(serializers.ModelSerializer):
    title_translated = serializers.SerializerMethodField()
    description_translated = serializers.SerializerMethodField()

    class Meta:
        model = AssessmentCategory
        fields = ['id', 'title', 'title_tl', 'description', 'description_tl', 
                 'title_translated', 'description_translated', 'created_at', 'updated_at']

    def get_title_translated(self, obj):
        language = self.context.get('language', 'en')
        return obj.get_title(language)

    def get_description_translated(self, obj):
        language = self.context.get('language', 'en')
        return obj.get_description(language)

class QuestionSerializer(serializers.ModelSerializer):
    question_text_translated = serializers.SerializerMethodField()
    category_translated = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'category', 'question_text', 'question_text_tl', 
                 'question_text_translated', 'question_category', 
                 'category_translated', 'created_at', 'updated_at']

    def get_question_text_translated(self, obj):
        language = self.context.get('language', 'en')
        return obj.get_question_text(language)

    def get_category_translated(self, obj):
        language = self.context.get('language', 'en')
        return obj.get_category_translation(language)

class ResponseSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    question_category = serializers.CharField(source='question.question_category', read_only=True)

    class Meta:
        model = AssessmentResponse
        fields = ['id', 'assessment', 'question', 'question_text', 'question_category', 'response']

    def validate_response(self, value):
        """
        Check that the response value is one of the valid choices
        """
        valid_choices = [choice[0] for choice in AssessmentResponse.RESPONSE_CHOICES]
        if value.lower() not in valid_choices:
            raise serializers.ValidationError(
                f"Invalid response. Must be one of: {', '.join(valid_choices)}"
            )
        return value.lower()

    def validate(self, data):
        """
        Check that the question belongs to the assessment's category and
        that we don't have duplicate responses
        """
        assessment = data.get('assessment')
        question = data.get('question')
        
        if assessment and question:
            # Check if question belongs to assessment category
            if question.category != assessment.category:
                raise serializers.ValidationError(
                    "Question does not belong to the assessment category"
                )
            
            # Check for duplicate response
            if AssessmentResponse.objects.filter(
                assessment=assessment,
                question=question
            ).exists():
                raise serializers.ValidationError(
                    "A response for this question already exists"
                )
        
        return data

class AssessmentSerializer(serializers.ModelSerializer):
    student_details = StudentListSerializer(source='student.student_info.user', read_only=True)
    category_details = CategorySerializer(source='category', read_only=True)
    assessor_name = serializers.CharField(source='assessor.username', read_only=True)
    student_name = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.title', read_only=True)
    responses = ResponseSerializer(many=True, read_only=True, source='assessmentresponse_set')
    category_scores = serializers.SerializerMethodField()

    class Meta:
        model = StudentAssessment
        fields = ['id', 'student', 'student_details', 'student_name', 
                 'category', 'category_details', 'category_name',
                 'assessor', 'assessor_name', 'date', 'completed', 
                 'responses', 'category_scores', 'results_available_date', 
                 'assessment_number']
        read_only_fields = ['assessor', 'date', 'category_scores', 
                           'assessment_number', 'student_name', 'category_name', 
                           'assessor_name']

    def get_student_name(self, obj):
        if obj.student and obj.student.student_info and obj.student.student_info.user:
            user = obj.student.student_info.user
            return f"{user.first_name} {user.last_name}"
        return "Unknown Student"

    def get_category_scores(self, obj):
        if obj.are_results_available and obj.completed:
            return obj.calculate_category_scores()
        return None

    def validate(self, data):
        # Only validate required fields for creation, not for updates
        if self.instance is None:  # This is a creation
            if not data.get('student'):
                raise serializers.ValidationError({'student': 'Student field is required'})
            if not data.get('category'):
                raise serializers.ValidationError({'category': 'Category field is required'})
        return data

    def create(self, validated_data):
        # Set the assessor from the context
        validated_data['assessor'] = self.context['request'].user
        # Set the date to current date
        validated_data['date'] = timezone.now()
        # Calculate results_available_date (30 days from now)
        validated_data['results_available_date'] = timezone.now() + timedelta(days=30)
        
        return super().create(validated_data)
