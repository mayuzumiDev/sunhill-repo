from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from ...serializers.accounts.edit_account_serializers import *

class CustomUserEditView(generics.UpdateAPIView):
    permission_classes = [AllowAny]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserEditSerializer
    http_method_names = ['patch']

    def partial_update(self, request,  pk=None, *args, **kwargs):
        return super().partial_update(request, pk, *args, **kwargs)
    
class UserInfoEditView(generics.UpdateAPIView):
    permission_classes = [AllowAny]
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoEditSerializer
    http_method_names = ['patch']

    def partial_update(self, request,  pk=None, *args, **kwargs):
        return super().partial_update(request, pk, *args, **kwargs)