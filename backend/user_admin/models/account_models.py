from django.db import models
from django.forms import ImageField
from api.models import CustomUser
from django.core.files.storage import FileSystemStorage
from django.conf import settings

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

profile_storage = FileSystemStorage(
    location=settings.PROFILE_IMAGES_LOCATION,
    base_url=settings.MEDIA_URL + 'profile_images/'
)

# Create your models here.
class UserInfo(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="user_info")
    contact_no = models.CharField(max_length=20, null=True)
    profile_image = models.ImageField(upload_to='', storage=profile_storage, blank=True, null=True)

class TeacherInfo(models.Model):
    teacher_info = models.OneToOneField(UserInfo, on_delete=models.CASCADE, related_name="teacher_info")
    staff_position = models.CharField(max_length=20, null=True)

class StudentInfo(models.Model):
    student_info = models.OneToOneField(UserInfo, on_delete=models.CASCADE, related_name="student_info") 
    grade_level = models.CharField(max_length=20, choices=GRADE_LEVEL_CHOICES, null=True)

class ParentInfo(models.Model):
    parent_info = models.OneToOneField(UserInfo, on_delete=models.CASCADE, related_name='parent_info') 
    student_info = models.ManyToManyField(StudentInfo, related_name='parent_student') 

class PublicInfo(models.Model):
    user_info = models.OneToOneField(UserInfo, on_delete=models.CASCADE, related_name='public_info')
    street_address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
