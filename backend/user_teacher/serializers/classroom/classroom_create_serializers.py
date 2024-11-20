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

        if request and hasattr(request.user, 'teacher_info'):
            validated_data['class_instructor'] = request.user.teacher_info
        else:
            raise serializers.ValidationError("Only teachers can create classrooms")
        
        return super().create(validated_data)

class ClassroomListSerializer(serializers.ModelSerializer):
    class_instructor = ClassroomTeacherInfoSerializer(read_only=True)
    student_count = serializers.SerializerMethodField()

    def get_student_count(self, obj):
        return obj.enrolled_students.filter(is_active=True).count()

    class Meta:
        model = Classroom
        fields = ['id', 'class_instructor', 'grade_level', 'subject_name', 'class_section']