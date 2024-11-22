from rest_framework import serializers
from user_teacher.models.classroom_models import *
from user_admin.models.account_models import TeacherInfo

class ClassroomTeacherInfoSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='teacher_info.user.first_name', read_only=True)
    last_name = serializers.CharField(source='teacher_info.user.last_name', read_only=True)

    class Meta:
        model = TeacherInfo
        fields = ['id', 'first_name', 'last_name']

class ClassroomCreateSerializer(serializers.ModelSerializer):
    class_instructor = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Classroom
        fields = ['class_instructor', 'grade_level', 'subject_name', 'class_section']

    def create(self, validated_data):
        request = self.context.get('request')

        if not request or not request.user:
            raise serializers.ValidationError("Authentication required")
            
        if not hasattr(request.user, 'user_info'):
            raise serializers.ValidationError("User has no user_info")
            
        user_info = request.user.user_info
        if not hasattr(user_info, 'teacher_info'):
            raise serializers.ValidationError("User is not a teacher")
            
        teacher_info = user_info.teacher_info
        if not teacher_info:
            raise serializers.ValidationError("Teacher info not found")
        
        validated_data['class_instructor'] = teacher_info
        return super().create(validated_data)

class ClassroomEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = ['grade_level', 'subject_name', 'class_section']
