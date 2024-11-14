from rest_framework import serializers
from api.models import CustomUser

class GetCurrentTeacherSerializer(serializers.ModelSerializer):
    user_info = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'branch_name', 'role', 'user_info', ]

    def get_user_info(self, instance):
        user_info = instance.user_info
        return {
            'user_info_id': user_info.id,
            'contact_no': user_info.contact_no
        }
