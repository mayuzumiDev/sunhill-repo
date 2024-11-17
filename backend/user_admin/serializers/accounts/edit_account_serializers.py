from rest_framework import serializers
from ...models.account_models import *


class CustomUserEditSerializer(serializers.ModelSerializer):
    class Meta:
         model = CustomUser
         fields = ['id', 'username', 'email', 'first_name', 'last_name', 'branch_name']

class UserInfoEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['id','contact_no']
        extra_kwargs = {'contact_no': {'allow_null': True}}

class TeacherInfoEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherInfo
        fields = ['id', 'staff_position']

class StudentInfoEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentInfo
        fields = ['id', 'grade_level']

class ParentInfoEditSerializer(serializers.ModelSerializer):
    student_info = serializers.PrimaryKeyRelatedField(many=True, queryset=StudentInfo.objects.all())

    class Meta:
        model = ParentInfo
        fields = ['id', 'student_info']

    def update(self, instance, validated_data):
        student_info = validated_data.pop('student_info', None)

        if student_info is not None:
            instance.student_info.set(student_info)
        return super().update(instance, validated_data)