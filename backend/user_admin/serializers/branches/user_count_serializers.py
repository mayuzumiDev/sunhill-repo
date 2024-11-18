from rest_framework import serializers
from api.models import CustomUser

class UserRoleCountSerializer(serializers.ModelSerializer):
    teacher_count = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()
    parent_count = serializers.SerializerMethodField()
    total_users = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['branch_name', 'teacher_count', 'student_count', 'parent_count', 'total_users']

    def get_teacher_count(self, obj):
        return CustomUser.objects.filter(branch_name=obj['branch_name'], role='teacher').count()

    def get_student_count(self, obj):
        return CustomUser.objects.filter(branch_name=obj['branch_name'], role='student').count()

    def get_parent_count(self, obj):
        return CustomUser.objects.filter(branch_name=obj['branch_name'], role='parent').count()

    def get_total_users(self, obj):
        return CustomUser.objects.filter(branch_name=obj['branch_name']).count()
    
    @staticmethod
    def get_role_counts_by_branch():
        # Get unique branches with role counts
        branches = CustomUser.objects.values('branch_name').distinct()
        return branches
