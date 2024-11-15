from rest_framework import serializers
from api.models import CustomUser
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

class StudentListSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()
    student_info = serializers.SerializerMethodField()
    
    def get_user_info(self, instance):
        user_info = instance.user_info
        return {
            'id': user_info.id,
            'contact_no': user_info.contact_no
        }
    
    def get_student_info(self, instance):
        user_info = instance.user_info
        student_info = user_info.student_info
        return {
            'id': user_info.student_info.id,
            'grade_level': student_info.grade_level,
        }

    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name', 'username', 'email', 'branch_name', 'user_info', 'student_info')

class ParentListSerializer(serializers.ModelSerializer):
    parent_info_id = serializers.IntegerField(source='user_info.parent_info.id', read_only=True)
    user_info = serializers.SerializerMethodField()
    student_info = serializers.SerializerMethodField()

    def get_user_info(self, instance):
        user_info = instance.user_info
        return {
            'id': user_info.id,
            'contact_no': user_info.contact_no
        }

    def get_student_info(self, instance):
        # Access the ParentInfo, then StudentInfo, and retrieve both id and grade_level
        parent_info = instance.user_info.parent_info if hasattr(instance.user_info, 'parent_info') else None
        if parent_info and parent_info.student_info:
            student_info_list = []
            for student_info in parent_info.student_info.all():
                user_info = student_info.student_info
                
                custom_user_id = user_info.user.id if user_info and user_info.user else None
                
                student_info_list.append({
                    'student_user_id': custom_user_id,
                    'grade_level': student_info.grade_level if student_info else None
                })

            return student_info_list

    class Meta:
        model = CustomUser
        fields = ('id', 'parent_info_id', 'first_name', 'last_name', 'username', 'email', 'branch_name', 'user_info', 'student_info')

class PublicUserListSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()

    def get_user_info (self, instance):
        user_info = instance.user_info
        return {
            'id': user_info.id,
            'contact_no': user_info.contact_no
        }

    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name', 'username', 'email', 'user_info')