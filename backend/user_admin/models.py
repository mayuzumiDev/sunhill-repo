from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from api.models import CustomUser

# Create your models here.
class TeacherInfo(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

    first_name = models.CharField(max_length=50, null=True) 
    last_name = models.CharField(max_length=100, null=True)

class StudentInfo(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

    first_name = models.CharField(max_length=50, null=True) 
    last_name = models.CharField(max_length=100, null=True)
    grade_level = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(6)],null=True)

class ParentInfo(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

    first_name = models.CharField(max_length=50, null=True) 
    last_name = models.CharField(max_length=100, null=True)
    contact_no = models.CharField(max_length=20)