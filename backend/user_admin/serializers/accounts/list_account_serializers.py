from rest_framework import serializers
from api.models import CustomUser
from ...models.account_models import *

class TeacherListSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()
    teacher_info = serializers.SerializerMethodField()

    def get_user_info(self, instance):
        user_info = instance.user_info
        return {
            'id': user_info.id,
            'contact_no': user_info.contact_no
        }
    
    def get_teacher_info(self, instance):
        user_info = instance.user_info
        teacher_info = user_info.teacher_info
        return {
            'id': teacher_info.id,
            'staff_position': teacher_info.staff_position
        }

    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name', 'username', 'email', 'branch_name', 'user_info', 'teacher_info')

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
                    'student_info_id': student_info.id,
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