from rest_framework import serializers
from api.models import CustomUser
from django.conf import settings

class CurrentAdminSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()

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
        if not hasattr(instance, 'user_info') or instance.user_info is None:
            return None

        user_info = instance.user_info
        profile_image_url = None
        if user_info.profile_image:
            request = self.context.get('request')
            if request is not None:
                profile_image_url = request.build_absolute_uri(user_info.profile_image.url)

        return {
            'id': user_info.id,
            'contact_no': user_info.contact_no,
            'profile_image': profile_image_url
        }
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name', 'branch_name', 'user_info']
        read_only_fields = fields