from django.db import models
from django.forms import ImageField
from django.core.validators import MinValueValidator, MaxValueValidator
from api.models import CustomUser

# Create your models here.
class UserInfo(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    contact_no = models.CharField(max_length=20)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

class StudentInfo(models.Model):
    student_info = models.OneToOneField(UserInfo, on_delete=models.CASCADE)
    grade_level = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(6)],null=True)

class ParentInfo(models.Model):
    parent_info = models.OneToOneField(UserInfo, on_delete=models.CASCADE)
    student_info = models.ForeignKey(StudentInfo, on_delete=models.CASCADE, related_name='parents')
