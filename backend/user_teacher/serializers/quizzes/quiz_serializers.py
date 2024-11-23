from rest_framework import serializers
from user_teacher.models.quizzes_models import Quiz
from user_teacher.models.classroom_models import Classroom
from user_admin.models.account_models import TeacherInfo

class QuizSerializer(serializers.ModelSerializer):
    classroom_name = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'id', 
            'classroom', 
            'classroom_name', 
            'title', 
            'description', 
            'created_by', 
            'created_by_name', 
            'created_at', 
            'updated_at', 
            'due_date'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by', 'created_by_name']

    def get_classroom_name(self, obj):
        if obj.classroom:
            return f"{obj.classroom.grade_level} - {obj.classroom.class_section} ({obj.classroom.subject_name})"
        return None

    def get_created_by_name(self, obj):
        if obj.created_by:
            user = obj.created_by.teacher_info.user.first_name
            return f"{obj.created_by.teacher_info.user.first_name} {obj.created_by.teacher_info.user.last_name}"
        return None

    def create(self, validated_data):
        request = self.context.get('request')
        
        # # If no request or user, raise validation error
        if not request or not request.user:
            raise serializers.ValidationError("Authentication required")
        
        # # Ensure the user has teacher info
        if not hasattr(request.user, 'user_info') or not hasattr(request.user.user_info, 'teacher_info'):
            raise serializers.ValidationError("User is not a teacher")
        
        # Set the created_by to the current teacher
        validated_data['created_by'] = request.user.user_info.teacher_info
        
        return super().create(validated_data)

    def validate(self, data):
        if not data.get('title'):
            raise serializers.ValidationError({"title": "Quiz title cannot be empty"})
        
        return data