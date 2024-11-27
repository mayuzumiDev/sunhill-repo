from django.db import models
from django.core.validators import FileExtensionValidator
from user_admin.models.account_models import TeacherInfo, StudentInfo
from cloudinary_storage.storage import RawMediaCloudinaryStorage
from cloudinary.models import CloudinaryField

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

MATERIAL_TYPES = [
    ('ppt', 'Presentation'),
    ('pdf', 'PDF Document'),
    ('img', 'Image'),
    ('vid', 'Video'),
    ('doc', 'Word Document'),
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

class EducationMaterial(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='materials')
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=255, blank=True)
    material_type = models.CharField(max_length=10, choices=MATERIAL_TYPES)
    original_filename = models.CharField(max_length=255)  # Store original filename
    file = CloudinaryField('file')  # This will store in Cloudinary
    cloudinary_url = models.URLField(max_length=500, blank=True)  # Store the full URL

    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.file and not self.original_filename:
            self.original_filename = self.file.name
            # Store the Cloudinary URL
            self.cloudinary_url = self.file.url
        super().save(*args, **kwargs)

