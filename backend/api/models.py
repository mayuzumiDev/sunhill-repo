from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from django.db import models
from datetime import timedelta
from django.utils import timezone
from enum import Enum
from django.db.models import Q

# Define user roles
class UserRole(Enum):
    ADMIN = 'admin'
    STUDENT = 'student'
    TEACHER = 'teacher'
    PARENT = 'parent'
    PUBLIC = 'public'

# Create custom user model
class CustomUser(AbstractUser):
    email = models.EmailField(blank=True, null=True) 
    role = models.CharField(max_length=10, choices=[(role.value, role.name) for role in UserRole],) # Add user role field
    branch_name = models.CharField(max_length=50, blank=True, null=True) # Add school branch name field

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
        self._password = raw_password

    def update(self,  **kwargs):
        for field, value in kwargs.items():
            setattr(self, field, value)
        self.save()
        
class PasswordResetCode(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='password_reset_codes', null=True, blank=True)
    user_email = models.EmailField(blank=True)
    code = models.CharField(max_length=4)  # 4-digit verification code
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        # Automatically set the user's email
        if self.user:
            self.user_email = self.user.email

        # Automatically set the expiration time to 10 minutes from creation
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)

        super().save(*args, **kwargs)

    def check_verification_code(self, code):
        if self.code == code and self.expires_at >  timezone.now():
            return True
        return False    

    def __str__(self):
        return f"{self.user.email} - {self.code}"