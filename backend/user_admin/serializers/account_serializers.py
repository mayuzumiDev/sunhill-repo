from rest_framework import serializers
from api.models import CustomUser
from django.core.validators import MinLengthValidator, MaxLengthValidator
from ..models.account_models import UserInfo, StudentInfo

class CreateAcountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'role', 'branch_name')
        extra_kwargs = {
            'username': {'required': True, 'validators': [MinLengthValidator(6), MaxLengthValidator(12)]},
            'password': {'write_only': True, 'required': True, 'validators':[MinLengthValidator(8),  MaxLengthValidator(32),]},
        }

    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()

        user_info = UserInfo.objects.create(user=user)

        role = validated_data.get('role')
        if role == 'student':
            try:
                StudentInfo.objects.create(student_info=user_info)
            except Exception as e:
                raise serializers.ValidationError(f'Creating instance to StudentInfo failed: {e}')
        else:
            pass
        return user

