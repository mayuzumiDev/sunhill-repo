from rest_framework import serializers
from user_admin.models.account_models import StudentInfo

class StudentInfoSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='student_info.user.first_name', read_only=True)
    last_name = serializers.CharField(source='student_info.user.last_name', read_only=True)
    branch_name = serializers.CharField(source='student_info.user.branch_name', read_only=True)
    
    class Meta:
        model = StudentInfo
        fields = ['id', 'first_name', 'last_name', 'grade_level', 'branch_name']