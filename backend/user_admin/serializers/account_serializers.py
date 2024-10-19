from rest_framework import serializers
from django.utils.text import slugify
from api.models import CustomUser, UserRole
from ..models.account_models import UserInfo, StudentInfo, ParentInfo
import random
import datetime

class CreateAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('role', 'branch_name')

    # Generate a unique username based on the user's role and current year
    def generate_username(self, role):
        current_year = datetime.datetime.now().year % 100
        username_role_map = {
            'teacher': 'TCH',
            'student': 'STU',
            'parent': 'PAR',
        }

        username_role = username_role_map.get(role, 'PUB')
        username = slugify(f"{username_role}-{current_year}-{self.random_number}")

        # Ensure the username is unique by checking against existing usernames
        while CustomUser.objects.filter(username=username).exists():
            self.random_number = random.randint(1000, 9999)
            username = slugify(f"{role}-{current_year}-{self.random_number}")

        return username # Ex: tch-24-1234
    
    # Generate a password based on the user's role
    def generate_password(self, role):
        password = slugify(f"{role}{self.random_number}")
        
        return password # Ex: teacher1234

    # Create a new user account
    def create(self, validated_data):
        role = validated_data['role']
        self.random_number = random.randint(1000,9999)

        username = self.generate_username(role)
        password = self.generate_password(role)

        # Create a new CustomUser  instance with the generated username and validated data
        user = CustomUser(username=username, **validated_data)
        user.set_password(password)
        user.save()

        user_info = UserInfo.objects.create(user=user) # Create a UserInfo instance associated with the user

        # If the role is 'student', create a StudentInfo instance
        if role == 'student':
            try:
                StudentInfo.objects.create(student_info=user_info)
            except Exception as e:
                raise serializers.ValidationError(f'Creating instance to StudentInfo failed: {e}')
        else:
            pass

        return {
            'user': user,
            'role': role,
            'generated_username': username,
            'generated_password': password,
        }

class ParentStudentLinkSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('student_username',)

    # Create a parent account linked to a student account based on the provided username
    def create(self, validated_data):
        student_username = validated_data.pop('student_username')

        try:
            # Retrieve the student user based on the username and role
            student_user = CustomUser.objects.get(username=student_username, role='student')
            student_info = UserInfo.objects.get(user=student_user)
            student_instance = StudentInfo.objects.get(student_info=student_info)

        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Student with provided username does not exist")
        
        except StudentInfo.DoesNotExist:
            raise serializers.ValidationError("StudentInfo for the provided username does not exist")

        # Prepare data for creating a parent account
        parent_data = {
            'role': 'parent',
            'branch_name': student_user.branch_name  
        }

        # Create a parent account using the CreateAccountSerializer
        parent_account = CreateAccountSerializer().create(parent_data)
        parent_user = parent_account['user']
        parent_user_info = UserInfo.objects.get(user=parent_user)

        # Create a ParentInfo instance linking the parent and student info
        parent_info = ParentInfo.objects.create(
            parent_info=parent_user_info,
            student_info=student_instance
        )

        return parent_account

