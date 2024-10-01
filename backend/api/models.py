from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import timedelta
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
    email = models.EmailField(('email'), unique=True)
    role = models.CharField(max_length=10, choices=[(role.value, role.name) for role in UserRole],) # Add user role field
    branch_name = models.CharField(max_length=50, blank=True, null=True) # Add school branch name field

class PasswordResetCode(models.Model):
    email = models.ForeignKey(CustomUser, on_delete=models.CASCADE, to_field='email', related_name='password_reset_codes', null=True)
    code = models.CharField(max_length=4)  # 4-digit verification code
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        # Automatically set the expiration time to 10 minutes from creation
        if not self.expires_at:
            self.expires_at = self.created_at + timedelta(minutes=10)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.code}"