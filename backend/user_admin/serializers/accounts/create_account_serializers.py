from rest_framework import serializers
from django.utils.text import slugify
from api.models import CustomUser, UserRole
from ...models.account_models import *
import random
import datetime

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model =  CustomUser
        fields = []

class AccountGenerator:
    def __init__(self):
        self.random_number = random.randint(1000, 9999)

    # Generate a unique username based on the user's role and current year
    def generate_username(self, role, random_part=None):
        current_year = datetime.datetime.now().year % 100
        username_role_map = {
            'teacher': 'TCH',
            'student': 'STU',
            'parent': 'PAR',
            'public': 'PUB', # must be delete before deploying
        }

        username_role = username_role_map.get(role, 'PUB')

        if random_part is None:
            username = slugify(f"{username_role}-{current_year}-{self.random_number}")

            # Ensure the username is unique by checking against existing usernames
            while CustomUser.objects.filter(username=username).exists():
                self.random_number = random.randint(1000, 9999)
                username = slugify(f"{role}-{current_year}-{self.random_number}")

            return username # Ex: tch-24-1234
        else:
            return slugify(f"{role}-{current_year}-{random_part}")
    
    # Generate a password based on the user's role
    def generate_password(self, role, random_part=None):
        if random_part is None:
            password = slugify(f"{role}{self.random_number}")
            return password # Ex: teacher1234
        else:
            return slugify(f"{role}{random_part}")

class CreateAccountSerializer(serializers.ModelSerializer):
    generated_username = serializers.CharField(required=False)
    generated_password = serializers.CharField(required=False)
    account_count = serializers.IntegerField(min_value=1, default=1)

    class Meta:
        model = CustomUser
        fields = ('role', 'branch_name', 'generated_username', 'generated_password', 'account_count')

    def generate_account(self, validated_data):
        role = validated_data['role']

        account_generator = AccountGenerator()

        username = account_generator.generate_username(role)
        password = account_generator.generate_password(role)
        parent_username = None
        parent_password = None

        if(role == "student"):
            parent_username = account_generator.generate_username("parent")
            parent_password = account_generator.generate_password("parent")

        return {
            'generated_username': username,
            'generated_password': password,
            'parent_username': parent_username,
            'parent_password': parent_password
        }

    # Create a new user account
    def create(self, validated_data):
        username = validated_data.get('generated_username')
        password = validated_data.get('generated_password')

        if not username or not password:
            raise serializers.ValidationError("Generated username and password must be provided.")

        # Create a new CustomUser  instance with the generated username and validated data
        user = CustomUser(username=username, role=validated_data['role'], branch_name=validated_data['branch_name'])
        user.set_password(password)
        user.save()

        user_info = UserInfo.objects.create(user=user) # Create a UserInfo instance associated with the user

        if validated_data['role'] == 'teacher':
            try:
                teacher_info = TeacherInfo.objects.create(teacher_info=user_info)

            except Exception as e:
                raise serializers.ValidationError(f'Creating instance to TeacherInfo failed: {e}')
        # If the role is 'student', create a StudentInfo instance
        elif validated_data['role'] == 'student':
            try:
                student_info = StudentInfo.objects.create(student_info=user_info)

            except Exception as e:
                raise serializers.ValidationError(f'Creating instance to StudentInfo failed: {e}')
        else:
            pass

        return user

class ParentStudentLinkSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(write_only=True)
    generated_username = serializers.CharField(read_only=True)
    generated_password = serializers.CharField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ('student_username', 'generated_username', 'generated_password')

    # Create a parent account linked to a student account based on the provided username
    def create(self, validated_data):
        student_username = validated_data.pop('student_username')

        try:
            # Retrieve the student user based on the username and role
            student_user = CustomUser.objects.get(username=student_username, role='student')
            student_random_part = student_user.username.split('-')[-1]

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

        account_generator = AccountGenerator()
        parent_data['generated_username'] = account_generator.generate_username('parent', random_part=student_random_part)
        parent_data['generated_password'] = account_generator.generate_password('parent', random_part=student_random_part)

        generated_username = parent_data['generated_username']
        generated_password = parent_data['generated_password']

        # Create a parent account using the CreateAccountSerializer
        create_account_serializer = CreateAccountSerializer(data=parent_data)
        if create_account_serializer.is_valid(raise_exception=True):
            parent_account = create_account_serializer.create(parent_data)
            parent_user = parent_account
            parent_user_info = UserInfo.objects.get(user=parent_user)

            # Create a ParentInfo instance linking the parent and student info
            parent_info = ParentInfo.objects.create(
                parent_info=parent_user_info,
            )

            parent_info.student_info.set([student_instance])

            return {
                'user': parent_user,
                'generated_username': generated_username,
                'generated_password': generated_password,
            }
        else:
            raise serializers.ValidationError("Failed to create parent account")

