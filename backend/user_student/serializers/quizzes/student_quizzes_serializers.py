from rest_framework import serializers
from user_teacher.models.quizzes_models import Quiz, StudentResponse, QuizScore
from user_teacher.models.classroom_models import Classroom,  SUBJECT_CHOICES
from django.utils import timezone

class StudentQuizListSerializer(serializers.ModelSerializer):
    classroom_details = serializers.SerializerMethodField()
    subject_name = serializers.SerializerMethodField()
    has_submitted = serializers.SerializerMethodField()
    subject_display = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'id',
            'title',
            'description',
            'classroom_details',
            'subject_name',
            'subject_display',
            'has_submitted'
        ]

    def get_classroom_details(self, obj):
        if obj.classroom:
            instructor = obj.classroom.class_instructor
            instructor_name = f"{instructor.teacher_info.user.first_name} {instructor.teacher_info.user.last_name}".strip() if instructor and instructor.teacher_info and instructor.teacher_info.user else "Unknown"
            return {
                'id': obj.classroom.id,
                'grade_level': obj.classroom.grade_level,
                'section': obj.classroom.class_section,
                'instructor': instructor_name
            }
        return None

    def get_subject_display(self, obj):
        # Get the display value from SUBJECT_CHOICES
        subject_dict = dict(SUBJECT_CHOICES)
        return subject_dict.get(obj.classroom.subject_name, obj.classroom.subject_name)

    def get_subject_name(self, obj):
        return obj.classroom.subject_name if obj.classroom else None

    def get_has_submitted(self, obj):
        request = self.context.get('request')
        if request and hasattr(request.user, 'studentinfo'):
            return StudentResponse.objects.filter(
                student=request.user.studentinfo,
                quiz=obj
            ).exists()
        return False