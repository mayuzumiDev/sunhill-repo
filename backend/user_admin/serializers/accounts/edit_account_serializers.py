from rest_framework import serializers
from ...models.account_models import *

class UserInfoEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['id','contact_no']
        extra_kwargs = {'contact_no': {'allow_null': True}}

class CustomUserEditSerializer(serializers.ModelSerializer):
    class Meta:
         model = CustomUser
         fields = ['id', 'username', 'email', 'first_name', 'last_name', 'branch_name']