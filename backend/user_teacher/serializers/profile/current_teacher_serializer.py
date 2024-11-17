from rest_framework import serializers
from user_admin.models.account_models import CustomUser

class GetCurrentTeacherSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'branch_name', 'role', 'user_info']
        read_only_fields = ['role', 'user_info']

    def get_user_info(self, instance):
        try:
            user_info = instance.user_info
            if not user_info:
                return None
            
            request = self.context.get('request')
            profile_image_url = None
            if user_info.profile_image:
                if request is not None:
                    profile_image_url = request.build_absolute_uri(user_info.profile_image.url)
                else:
                    profile_image_url = user_info.profile_image.url
                
            return {
                'user_info_id': user_info.id,
                'contact_no': user_info.contact_no,
                'profile_image': profile_image_url
            }
        except Exception as e:
            print(f"Error serializing user_info: {str(e)}")
            return None
