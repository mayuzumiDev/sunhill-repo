from rest_framework import serializers
from api.models import CustomUser, UserRole
from ...models.account_models import UserInfo, StudentInfo, ParentInfo

class TeacherListSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    contact_no = serializers.CharField(read_only=True)
    branch_name = serializers.CharField(source='user.branch_name', read_only=True)

    is_teacher = serializers.SerializerMethodField()
    
    # Checks if the user associated with UserInfo instance is a teacher
    def get_is_teacher(self, instance):
        user = instance.user
        return user.role == 'teacher'

    class Meta:
        model = UserInfo
        fields = ('user_id', 'id', 'first_name', 'last_name', 'username', 'email', 'branch_name', 'contact_no', 'is_teacher')