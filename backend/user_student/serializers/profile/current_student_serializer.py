from rest_framework import serializers
from user_admin.models.account_models import CustomUser, UserInfo, StudentInfo
import logging

logger = logging.getLogger(__name__)

class GetCurrentStudentSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()
    student_info = serializers.SerializerMethodField()
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    branch_name = serializers.CharField(required=False, allow_blank=True)
    username = serializers.CharField(required=False)
    role = serializers.CharField(read_only=True)
    grade_level = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 
            'username', 
            'first_name', 
            'last_name', 
            'email', 
            'branch_name', 
            'grade_level',
            'role', 
            'user_info',
            'student_info'
        ]

    def get_student_info(self, instance):
        try:
            logger.info(f"Getting student info for user: {instance.id}")
            user_info = UserInfo.objects.get(user=instance)
            student_info = StudentInfo.objects.get(student_info=user_info)
            
            logger.info(f"Retrieved grade level from database: {student_info.grade_level}")
            
            return {
                'id': student_info.id,
                'student_number': student_info.student_number or 'Not Assigned'
            }
        
        except (UserInfo.DoesNotExist, StudentInfo.DoesNotExist) as e:
            logger.warning(f"Student info not found for user {instance.id}: {str(e)}")
            return {
                'id': None,
                
                'student_number': 'Not Assigned'
            }
        except Exception as e:
            logger.error(f"Error getting student info for user {instance.id}: {str(e)}")
            return {
                'id': None,
                
            }

    def get_grade_level(self, instance):
        try:
            user_info = UserInfo.objects.get(user=instance)
            student_info = StudentInfo.objects.get(student_info=user_info)
            return student_info.grade_level if student_info.grade_level else 'Not Assigned'
        except (UserInfo.DoesNotExist, StudentInfo.DoesNotExist):
            return 'Not Assigned'

    def get_user_info(self, instance):
        try:
            logger.info(f"Getting user info for user: {instance.id}")
            user_info = UserInfo.objects.get(user=instance)
            
            request = self.context.get('request')
            profile_image_url = None
            
            if user_info.profile_image and hasattr(user_info.profile_image, 'url'):
                try:
                    if request is not None:
                        profile_image_url = request.build_absolute_uri(user_info.profile_image.url)
                    else:
                        profile_image_url = user_info.profile_image.url
                    logger.info(f"Profile image URL built: {profile_image_url}")
                except Exception as e:
                    logger.error(f"Error building profile image URL: {str(e)}")
            
            return {
                'user_info_id': user_info.id,
                'contact_no': user_info.contact_no or '',
                'profile_image': profile_image_url
            }
            
        except UserInfo.DoesNotExist:
            logger.warning(f"User info not found for user {instance.id}, creating new one")
            user_info = UserInfo.objects.create(user=instance)
            return {
                'user_info_id': user_info.id,
                'contact_no': '',
                'profile_image': None
            }
        except Exception as e:
            logger.error(f"Error getting user info for user {instance.id}: {str(e)}")
            return {
                'user_info_id': None,
                'contact_no': '',
                'profile_image': None
            }
