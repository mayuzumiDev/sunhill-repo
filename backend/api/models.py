from django.contrib.auth.models import AbstractUser
from django.db import models
from enum import Enum

# Define user roles
class UserRole(Enum):
    ADMIN = 'admin'
    STUDENT = 'student'
    TEACHER = 'teacher'
    PARENT = 'parent'
    PUBLIC = 'public'

# Create custom user model
class CustomUser(AbstractUser):
    # Add role field
    role = models.CharField(max_length=10, choices=[(role.value, role.name) for role in UserRole],)

    # Add branch name field
    branch_name = models.CharField(max_length=50, blank=True, null=True)

