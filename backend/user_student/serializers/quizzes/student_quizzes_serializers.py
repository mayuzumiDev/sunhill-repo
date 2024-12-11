from rest_framework import serializers
from user_teacher.models.quizzes_models import Quiz, StudentResponse, QuizScore
from user_teacher.models.classroom_models import Classroom,  SUBJECT_CHOICES
from user_admin.models.account_models import StudentInfo
from django.utils import timezone

class StudentQuizListSerializer(serializers.ModelSerializer):
    classroom_details = serializers.SerializerMethodField()
    subject_name = serializers.SerializerMethodField()
    has_submitted = serializers.SerializerMethodField()
    subject_display = serializers.SerializerMethodField()
    score_details = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'id',
            'title',
            'type_of',
            'description',
            'classroom_details',
            'subject_name',
            'subject_display',
            'has_submitted',
            'score_details',
            'due_date'
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
        if request and hasattr(request.user, 'user_info'):
            
            try:
                student_info = StudentInfo.objects.get(student_info=request.user.user_info)
                has_submitted = StudentResponse.objects.filter(
                    student=student_info,
                    quiz=obj
                ).exists()

                return has_submitted
            except Exception as e:
                print(f"Error checking submission: {str(e)}")
                return False
                
        print("No request or user doesn't have user_info")
        return False

    def get_score_details(self, obj):
        request = self.context.get('request')
        if request and hasattr(request.user, 'user_info'):
            try:
                student_info = StudentInfo.objects.get(student_info=request.user.user_info)
                quiz_score = QuizScore.objects.filter(
                    student=student_info,
                    quiz=obj
                ).first()

                if quiz_score:
                    return {
                        'status': quiz_score.status,
                        'total_score': quiz_score.total_score,
                        'total_possible': quiz_score.total_possible,
                        'percentage_score': float(quiz_score.percentage_score)
                    }
            except Exception as e:
                print(f"Error fetching score details: {str(e)}")
                return None
        return None