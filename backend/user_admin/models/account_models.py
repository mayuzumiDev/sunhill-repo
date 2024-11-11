from django.db import models
from django.forms import ImageField
from django.core.validators import MinValueValidator, MaxValueValidator
from api.models import CustomUser

# Create your models here.
class UserInfo(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="userinfo")
    contact_no = models.CharField(max_length=20, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

class StudentInfo(models.Model):
    student_info = models.OneToOneField(UserInfo, on_delete=models.CASCADE, related_name="studentinfo") # Links to UserInfo for student-specific information
    grade_level = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(6)],null=True)

class ParentInfo(models.Model):
    parent_info = models.OneToOneField(UserInfo, on_delete=models.CASCADE) # Links to UserInfo for parent-specific information
    student_info = models.ForeignKey(StudentInfo, on_delete=models.CASCADE, related_name='parents') # Establishes a relationship between parent and student
