from django.http import JsonResponse
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError, PermissionDenied
from api.models import CustomUser
from ...models import UserInfo, ParentInfo, StudentInfo
from ...serializers.current_parent_serializers import CurrentParentSerializer
import logging

logger = logging.getLogger(__name__)

class CurrentParentView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CurrentParentSerializer

    def get_object(self):
        try:
            user = self.request.user
            if not user.is_authenticated:
                raise PermissionDenied("User is not authenticated")
            if not hasattr(user, 'user_info'):
                raise ValidationError("User info not found")
            if not hasattr(user.user_info, 'parent_info'):
                raise ValidationError("Parent info not found")
            if user.role != 'parent':
                raise PermissionDenied("User is not a parent")
            return user
        except Exception as e:
            logger.error(f"Error in get_object: {str(e)}")
            raise

    def retrieve(self, request, *args, **kwargs):
        try:
            user = self.get_object()
            serializer = self.get_serializer(user, context={'request': request})
            return JsonResponse({
                'status': 'success',
                'message': 'Current parent retrieved successfully',
                'current_parent': serializer.data
            }, status=status.HTTP_200_OK)
        except PermissionDenied as e:
            return JsonResponse({
                'status': 'error',
                'error': str(e)
            }, status=status.HTTP_403_FORBIDDEN)
        except ValidationError as e:
            return JsonResponse({
                'status': 'error',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error retrieving parent data: {str(e)}")
            return JsonResponse({
                'status': 'error',
                'error': 'Failed to retrieve parent data'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ParentCustomUserEditView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            user = CustomUser.objects.get(id=id)
            if request.user.role != 'parent':
                return JsonResponse({'error': 'Only parents can update their information'}, status=status.HTTP_403_FORBIDDEN)
            
            data = request.data
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.first_name = data.get('first_name', user.first_name)
            user.last_name = data.get('last_name', user.last_name)
            user.save()
            
            return JsonResponse({'message': 'User information updated successfully'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ParentUserInfoEditView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_info_id):
        try:
            user_info = UserInfo.objects.get(id=user_info_id)
            if request.user.role != 'parent':
                return JsonResponse({'error': 'Only parents can update their information'}, status=status.HTTP_403_FORBIDDEN)
            
            data = request.data
            user_info.contact_no = data.get('contact_no', user_info.contact_no)
            user_info.save()
            
            return JsonResponse({'message': 'Contact information updated successfully'}, status=status.HTTP_200_OK)
        except UserInfo.DoesNotExist:
            return JsonResponse({'error': 'User info not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
