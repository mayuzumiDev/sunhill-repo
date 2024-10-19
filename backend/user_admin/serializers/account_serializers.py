from rest_framework import serializers
from django.utils.text import slugify
from api.models import CustomUser, UserRole
from ..models.account_models import UserInfo, StudentInfo, ParentInfo
import random
import datetime

class CreateAcountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('role', 'branch_name')

    def generate_username(self, role):
        current_year = datetime.datetime.now().year % 100
        username_role_map = {
            'teacher': 'TCH',
            'student': 'STU',
            'parent': 'PAR',
        }

        username_role = username_role_map.get(role, 'PUB')
        username = slugify(f"{username_role}-{current_year}-{self.random_number}")

        while CustomUser.objects.filter(username=username).exists():
            self.random_number = random.randint(1000, 9999)
            username = slugify(f"{role}-{current_year}-{self.random_number}")

        return username
    
    def generate_password(self, role):
        password = slugify(f"{role}{self.random_number}")
        return password

    def create(self, validated_data):
        role = validated_data['role']
        self.random_number = random.randint(1000,9999)

        username = self.generate_username(role)
        password = self.generate_password(role)

        user = CustomUser(username=username, **validated_data)
        user.set_password(password)
        user.save()

        user_info = UserInfo.objects.create(user=user)

        if role == 'student':
            try:
                StudentInfo.objects.create(student_info=user_info)
            except Exception as e:
                raise serializers.ValidationError(f'Creating instance to StudentInfo failed: {e}')
        else:
            pass

        return {
            'user': user,
            'generated_username': username,
            'generated_password': password,
        }

