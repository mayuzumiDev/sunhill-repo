from rest_framework import serializers
from user_teacher.models.classroom_models import ClassRoomStudent, Classroom, SUBJECT_CHOICES
from user_admin.models.account_models import TeacherInfo

class InstructorSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = TeacherInfo
        fields = ['id', 'full_name']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class StudentClassroomListSerializer(serializers.ModelSerializer):
    # Fields from the Classroom model
    classroom_id = serializers.IntegerField(source='classroom.id')
    grade_level = serializers.CharField(source='classroom.grade_level')
    class_section = serializers.CharField(source='classroom.class_section')
    subject_name = serializers.CharField(source='classroom.subject_name')
    subject_display = serializers.SerializerMethodField()
    
    # Instructor information
    instructor = serializers.SerializerMethodField()
    
    class Meta:
        model = ClassRoomStudent
        fields = [
            'id',
            'classroom_id',
            'grade_level',
            'class_section',
            'subject_name',
            'subject_display',
            'instructor',
            'enrollment_date',
            'is_active'
        ]

    def get_subject_display(self, obj):
        # Get the display value from SUBJECT_CHOICES
        subject_dict = dict(SUBJECT_CHOICES)
        return subject_dict.get(obj.classroom.subject_name, obj.classroom.subject_name)

    def get_instructor(self, obj):
        teacher = obj.classroom.class_instructor
        user = teacher.teacher_info.user
        return {
            'id': teacher.id,
            'full_name': f"{user.first_name} {user.last_name}"
        }