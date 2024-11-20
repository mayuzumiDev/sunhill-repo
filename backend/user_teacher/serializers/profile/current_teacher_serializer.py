from rest_framework import serializers
from user_admin.models.account_models import *
import logging

logger = logging.getLogger(__name__)

class GetCurrentTeacherSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()
    teacher_info = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'branch_name', 'role', 'user_info', 'teacher_info']
        read_only_fields = ['role', 'user_info']

    def get_teacher_info(self, instance):
        user_info = instance.user_info
        teacher_info = user_info.teacher_info
        return {
            'id': teacher_info.id,
            'staff_position': teacher_info.staff_position
        }

    def get_user_info(self, instance):
        try:
            # Get or create user_info
            user_info, created = UserInfo.objects.get_or_create(user=instance)
            if created:
                logger.info(f"Created new UserInfo for user {instance.id}")
            
            request = self.context.get('request')
            profile_image_url = None
            
            if user_info.profile_image and user_info.profile_image.name:
                try:
                    if request is not None:
                        profile_image_url = request.build_absolute_uri(user_info.profile_image.url)
                    else:
                        profile_image_url = user_info.profile_image.url
                    logger.info(f"Profile image URL built: {profile_image_url}")
                except Exception as e:
                    logger.error(f"Error building profile image URL: {str(e)}")
                    profile_image_url = None
                
            return {
                'user_info_id': user_info.id,
                'contact_no': user_info.contact_no,
                'profile_image': profile_image_url
            }
        except Exception as e:
            logger.error(f"Error serializing user_info for user {instance.id}: {str(e)}")
            return None
