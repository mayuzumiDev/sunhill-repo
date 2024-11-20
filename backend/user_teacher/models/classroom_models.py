from django.db import models
from user_admin.models.account_models import TeacherInfo, StudentInfo

GRADE_LEVEL_CHOICES = [
    ('Nursery', 'Nursery'),
    ('Casa 1', 'Casa 1'),
    ('Casa 2', 'Casa 2'),
    ('Grade 1', 'Grade 1'),
    ('Grade 2', 'Grade 2'),
    ('Grade 3', 'Grade 3'),
    ('Grade 4', 'Grade 4'),
    ('Grade 5', 'Grade 5'),
    ('Grade 6', 'Grade 6'),
]

SUBJECT_CHOICES = [
    ('MORAL', 'Moral'),
    ('READING', 'Reading'),
    ('MATH', 'Math'),
    ('ECLP', 'English Computerized Learning Program'),
    ('ROBOTICS', 'Robotics'),
    ('ENGLISH', 'English'),
    ('SCIENCE', 'Science'),
    ('FILIPINO', 'Filipino'),
    ('MOTHER_TONGUE', 'Mother Tongue'),
    ('ARALING_PANLIPUNAN', 'Araling Panlipunan'),
    ('MAPEH', 'MAPEH'),
    ('VALUES_EDUCATION', 'Values Education'),
    ('HELE', 'Home Economics & Livelihood Education'),
]

class Classroom(models.Model):
    class_instructor = models.ForeignKey(TeacherInfo, on_delete=models.CASCADE, related_name='classrooms')
    grade_level = models.CharField(max_length=20, choices=GRADE_LEVEL_CHOICES, null=True)
    class_section = models.CharField(max_length=20, null=True)
    subject_name = models.CharField(max_length=50, choices=SUBJECT_CHOICES)

class ClassRoomStudent(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='enrolled_students')
    student = models.ForeignKey(StudentInfo, on_delete=models.CASCADE, related_name='enrolled_classrooms')
    enrollment_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
