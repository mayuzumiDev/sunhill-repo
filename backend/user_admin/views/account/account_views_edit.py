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

    def partial_update(self, request, pk=None, *args, **kwargs):
        # print("\n" + "="*50)
        # print("DEBUGGING STUDENT INFO UPDATE")
        # print("="*50)
        # print(f"REQUEST DATA: {request.data}")
        # print(f"has_special_needs type: {type(request.data.get('has_special_needs'))}")
        # print(f"has_special_needs value: {request.data.get('has_special_needs')}")
        
        instance = self.get_object()
        # print(f"\nBEFORE UPDATE:")
        # print(f"has_special_needs: {instance.has_special_needs}")
        # print(f"special_needs_details: {instance.special_needs_details}")
        
        # Explicitly handle the boolean conversion
        if 'has_special_needs' in request.data:
            has_special_needs = request.data['has_special_needs']
            if isinstance(has_special_needs, str):
                has_special_needs = has_special_needs.lower() == 'true'
            instance.has_special_needs = bool(has_special_needs)
            
        if 'special_needs_details' in request.data:
            instance.special_needs_details = request.data['special_needs_details']
            
        if 'grade_level' in request.data:
            instance.grade_level = request.data['grade_level']
            
        instance.save()
        
        # Verify the update
        updated_instance = StudentInfo.objects.get(pk=pk)
        # print(f"\nAFTER UPDATE:")
        # print(f"has_special_needs: {updated_instance.has_special_needs}")
        # print(f"special_needs_details: {updated_instance.special_needs_details}")
        # print("="*50 + "\n")
        
        return JsonResponse({
            'message': 'Student Info updated successfully.',
            'updated_data': {
                'has_special_needs': updated_instance.has_special_needs,
                'special_needs_details': updated_instance.special_needs_details,
                'grade_level': updated_instance.grade_level
            }
        }, status=status.HTTP_200_OK)
    
class ParentInfoEditView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ParentInfoEditSerializer
    queryset = ParentInfo.objects.all()
    http_method_names = ['patch']

    def partial_update(self, request,  pk=None, *args, **kwargs):
        response = super().partial_update(request, pk, *args, **kwargs)

        return JsonResponse ({'message': 'User Info updated successfully.'}, status=status.HTTP_200_OK)
