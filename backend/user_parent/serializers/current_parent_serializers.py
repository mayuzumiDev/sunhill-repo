from rest_framework import serializers
from api.models import CustomUser
from user_admin.models.account_models import UserInfo, ParentInfo, StudentInfo
from django.conf import settings
import re
import logging

logger = logging.getLogger(__name__)

class CurrentParentSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()
    parent_info = serializers.SerializerMethodField()
    student_info = serializers.SerializerMethodField()

    def validate_username(self, value):
        # Username length validation
        if len(value) < 6:
            raise serializers.ValidationError("Username must be at least 3 characters long")
        if len(value) > 20:
            raise serializers.ValidationError("Username cannot exceed 30 characters")
            
        # Username format validation (letters, numbers, and underscores only)
        if not re.match("^[a-zA-Z0-9_]+$", value):
            raise serializers.ValidationError("Username can only contain letters, numbers, and underscores")
            
        # Check if username is unique (excluding current user)
        if CustomUser.objects.exclude(pk=self.instance.pk).filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken")
            
        return value

    def get_user_info(self, instance):
        try:
            user_info = instance.user_info
            if not user_info:
                return None

            profile_image_url = None
            if user_info.profile_image:
                request = self.context.get('request')
                if request is not None:
                    profile_image_url = request.build_absolute_uri(user_info.profile_image.url)

            return {
                'id': user_info.id,
                'contact_no': user_info.contact_no or '',
                'profile_image': profile_image_url
            }
        except (AttributeError, UserInfo.DoesNotExist):
            logger.error(f"Error getting user info for user {instance.id}")
            return None

    def get_parent_info(self, instance):
        try:
            if not hasattr(instance.user_info, 'parent_info'):
                return None
            
            parent_info = instance.user_info.parent_info
            return {
                'id': parent_info.id,
                'user_info_id': parent_info.user_info.id
            }
        except (AttributeError, ParentInfo.DoesNotExist):
            logger.error(f"Error getting parent info for user {instance.id}")
            return None

    def get_student_info(self, instance):
        try:
            if not hasattr(instance.user_info, 'parent_info'):
                return []

            parent_info = instance.user_info.parent_info
            student_info_list = []

            if parent_info and hasattr(parent_info, 'student_info'):
                for student_info in parent_info.student_info.all():
                    if student_info and hasattr(student_info, 'student_info') and student_info.student_info.user:
                        user = student_info.student_info.user
                        user_info_data = None
                        
                        # Get the student's UserInfo instance
                        try:
                            student_user_info = UserInfo.objects.get(user=user)
                            profile_image_url = None
                            if student_user_info.profile_image:
                                request = self.context.get('request')
                                if request is not None:
                                    profile_image_url = request.build_absolute_uri(student_user_info.profile_image.url)
                            
                            user_info_data = {
                                'id': student_user_info.id,
                                'contact_no': student_user_info.contact_no or '',
                                'profile_image': profile_image_url
                            }
                        except UserInfo.DoesNotExist:
                            logger.warning(f"UserInfo not found for student user {user.id}")
                            user_info_data = None
                            
                        student_info_list.append({
                            'student_user_id': user.id,
                            'student_info_id': student_info.id,
                            'grade_level': student_info.grade_level,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'branch_name': user.branch_name,
                            'email': user.email,
                            'user_info': user_info_data
                        })

            return student_info_list
        except Exception as e:
            logger.error(f"Error getting student info for user {instance.id}: {str(e)}")
            return []
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'branch_name', 'role', 'user_info', 'parent_info', 'student_info'
        ]
        read_only_fields = [
            'id', 'branch_name', 'role', 'parent_info', 'student_info'
        ]