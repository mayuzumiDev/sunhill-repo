from rest_framework import serializers
from user_teacher.models.classroom_models import *
from user_teacher.serializers.classroom.classroom_manage_serializers import ClassroomTeacherInfoSerializer

class ClassroomListSerializer(serializers.ModelSerializer):
    class_instructor = ClassroomTeacherInfoSerializer(read_only=True)
    subject_name_display = serializers.SerializerMethodField()

    def get_subject_name_display(self, obj):
        return obj.get_subject_name_display()

    class Meta:
        model = Classroom
        fields = ['id', 'class_instructor', 'grade_level', 'subject_name', 'subject_name_display', 'class_section']