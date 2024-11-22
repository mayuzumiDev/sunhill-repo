from rest_framework import serializers
from user_teacher.models.classroom_models import *
from user_admin.models.account_models import *
from user_teacher.serializers.student_info_serializers import StudentInfoSerializer

class AddStudentToClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoomStudent
        fields = ['classroom', 'student']

    def validate(self, data):
        # Check if student already exists in the classroom
        if ClassRoomStudent.objects.filter(
            classroom=data['classroom'],
            student=data['student']
        ).exists():
            raise serializers.ValidationError(
                {"error": "Student is already enrolled in this classroom"}
            )
        return data

class ClassroomStudentListSerializer(serializers.ModelSerializer):
    student = StudentInfoSerializer(read_only=True)

    class Meta:
        model = ClassRoomStudent
        fields = ['id', 'classroom', 'student', 'enrollment_date', 'is_active']