from rest_framework import serializers
from api.models import CustomUser
from user_admin.models import (
    TeacherInfo,
    StudentInfo,
    ParentInfo,
)

class CreateAcountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'role', 'branch_name')
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
        }

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()

        info_models = {
            'teacher': TeacherInfo,
            'student': StudentInfo,
            'parent':  ParentInfo,
        }

        role = validated_data.get('role')
        if role in info_models:
            info_models[role].objects.create(user=user)
        else:
            raise serializers.ValidationError('Invalid role provided.')

        return user