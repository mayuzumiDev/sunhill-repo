from django.http import JsonResponse
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from api.models import CustomUser
from user_admin.models.account_models import UserInfo, ParentInfo, StudentInfo
from ...serializers.current_parent_serializers import CurrentParentSerializer
import logging

logger = logging.getLogger(__name__)

class CurrentParentView(generics.RetrieveUpdateAPIView):
    serializer_class = CurrentParentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        try:
            user = self.get_object()
            if not hasattr(user, 'user_info') or not hasattr(user.user_info, 'parent_info'):
                logger.warning(f"User {user.id} does not have parent info")
                return Response(
                    {"error": "Parent information not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = self.get_serializer(user)
            return Response({
                "status": "success",
                "data": serializer.data
            })
        except Exception as e:
            logger.error(f"Error retrieving parent info: {str(e)}")
            return Response(
                {"error": "Failed to retrieve parent information"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            
            if not hasattr(instance, 'user_info') or not hasattr(instance.user_info, 'parent_info'):
                logger.warning(f"User {instance.id} does not have parent info")
                return Response(
                    {"error": "Parent information not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return Response({
                "status": "success",
                "data": serializer.data
            })
        except Exception as e:
            logger.error(f"Error updating parent info: {str(e)}")
            return Response(
                {"error": "Failed to update parent information"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ParentCustomUserEditView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            user = CustomUser.objects.get(id=id)
            if request.user.role != 'parent':
                return Response(
                    {'error': 'Only parents can update their information'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            data = request.data
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.first_name = data.get('first_name', user.first_name)
            user.last_name = data.get('last_name', user.last_name)
            user.save()
            
            return Response(
                {'message': 'User information updated successfully'}, 
                status=status.HTTP_200_OK
            )
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class ParentUserInfoEditView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_info_id):
        try:
            user_info = UserInfo.objects.get(id=user_info_id)
            if request.user.role != 'parent':
                return Response(
                    {'error': 'Only parents can update their information'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            data = request.data
            user_info.contact_no = data.get('contact_no', user_info.contact_no)
            user_info.save()
            
            return Response(
                {'message': 'Contact information updated successfully'}, 
                status=status.HTTP_200_OK
            )
        except UserInfo.DoesNotExist:
            return Response(
                {'error': 'User info not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
