from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from ...serializers.accounts.edit_account_serializers import *

# View for editing custom user information
class CustomUserEditView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserEditSerializer
    http_method_names = ['patch']

    # Method to handle partial updates to the custom user
    def partial_update(self, request,  pk=None, *args, **kwargs):
        response = super().partial_update(request, pk, *args, **kwargs)

        return JsonResponse({'message': 'Custom User updated successfully.'}, status=status.HTTP_200_OK)

# View for editing user info
class UserInfoEditView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoEditSerializer
    http_method_names = ['patch']

    def partial_update(self, request,  pk=None, *args, **kwargs):
        response = super().partial_update(request, pk, *args, **kwargs)

        return JsonResponse ({'message': 'User Info updated successfully.'}, status=status.HTTP_200_OK)

class TeacherInfoEditView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = TeacherInfo.objects.all()
    serializer_class = TeacherInfoEditSerializer
    http_method_names = ['patch']

    def partial_update(self, request,  pk=None, *args, **kwargs):
        response = super().partial_update(request, pk, *args, **kwargs)

        return JsonResponse ({'message': 'Teacher Info updated successfully.'}, status=status.HTTP_200_OK)

class StudentInfoEditView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentInfoEditSerializer
    queryset = StudentInfo.objects.all()
    http_method_names = ['patch']

    def partial_update(self, request,  pk=None, *args, **kwargs):
        response = super().partial_update(request, pk, *args, **kwargs)

        return JsonResponse ({'message': 'Student Info updated successfully.'}, status=status.HTTP_200_OK)
    
class ParentInfoEditView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ParentInfoEditSerializer
    queryset = ParentInfo.objects.all()
    http_method_names = ['patch']

    def partial_update(self, request,  pk=None, *args, **kwargs):
        response = super().partial_update(request, pk, *args, **kwargs)

        return JsonResponse ({'message': 'User Info updated successfully.'}, status=status.HTTP_200_OK)
