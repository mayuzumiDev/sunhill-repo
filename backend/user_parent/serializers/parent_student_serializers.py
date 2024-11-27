from rest_framework import serializers
from user_admin.models.account_models import StudentInfo, ParentInfo, UserInfo

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['contact_no', 'profile_image']

class StudentInfoSerializer(serializers.ModelSerializer):
    user_info = UserInfoSerializer(source='student_info', read_only=True)
    first_name = serializers.CharField(source='student_info.user.first_name', read_only=True)
    last_name = serializers.CharField(source='student_info.user.last_name', read_only=True)
    branch_name = serializers.CharField(source='student_info.user.branch_name', read_only=True)
    
    class Meta:
        model = StudentInfo
        fields = ['id', 'grade_level', 'user_info', 'first_name', 'last_name', 'branch_name']

class ParentStudentSerializer(serializers.ModelSerializer):
    students = StudentInfoSerializer(source='student_info', many=True, read_only=True)
    
    class Meta:
        model = ParentInfo
        fields = ['id', 'students']