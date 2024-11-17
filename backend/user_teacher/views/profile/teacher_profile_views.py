from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from user_admin.models.account_models import CustomUser, UserInfo
from ...serializers.profile.current_teacher_serializer import GetCurrentTeacherSerializer
import os
import re
import logging

logger = logging.getLogger(__name__)

class GetCurrentTeacherView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GetCurrentTeacherSerializer

    def retrieve(self, request, *args, **kwargs):
        try:
            user_id = request.user.id
            logger.info(f"Retrieving teacher profile for user_id: {user_id}")
            
            teacher_info = CustomUser.objects.get(id=user_id)
            logger.info(f"Found teacher: {teacher_info.username}")

            if teacher_info.role != 'teacher':
                logger.warning(f"User {user_id} is not a teacher. Role: {teacher_info.role}")
                return JsonResponse({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = self.serializer_class(teacher_info, context={'request': request})
            return JsonResponse({"teacher_profile": serializer.data}, status=status.HTTP_200_OK)
        
        except CustomUser.DoesNotExist:
            logger.error(f"Teacher with user_id {user_id} not found")
            return JsonResponse({"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except ValidationError as e:
            logger.error(f"Validation error for user_id {user_id}: {str(e)}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Unexpected error retrieving teacher profile for user_id {user_id}: {str(e)}")
            return JsonResponse(
                {"error": "Error retrieving the current teacher profile", "details": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TeacherProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def validate_phone_number(self, phone):
        pattern = r'^09\d{9}$'
        return bool(re.match(pattern, phone))

    def patch(self, request):
        try:
            user = request.user
            if user.role != 'teacher':
                return JsonResponse({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

            # Get or create user_info
            user_info, created = UserInfo.objects.get_or_create(user=user)
            if created:
                logger.info(f"Created new UserInfo for user {user.id}")

            # Update user info
            if 'phone_number' in request.data:
                phone_number = request.data['phone_number']
                if phone_number:
                    if not self.validate_phone_number(phone_number):
                        return JsonResponse(
                            {"error": "Please enter a valid contact number (11 digits, starts with 09)"}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    user_info.contact_no = phone_number

            if 'email' in request.data:
                user_info.email = request.data['email']

            user_info.save()

            # Update user fields
            if 'first_name' in request.data:
                user.first_name = request.data['first_name']
            if 'last_name' in request.data:
                user.last_name = request.data['last_name']
            if 'username' in request.data:
                if len(request.data['username']) < 3 or len(request.data['username']) > 20:
                    return JsonResponse(
                        {"error": "Username must be between 3 and 20 characters"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                user.username = request.data['username']
            if 'email' in request.data:
                user.email = request.data['email']
            if 'branch_name' in request.data:
                user.branch_name = request.data['branch_name']
            
            user.save()

            return JsonResponse({"message": "Profile updated successfully"})
            
        except Exception as e:
            logger.error(f"Unexpected error updating teacher profile: {str(e)}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TeacherProfileImageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            user = request.user
            if user.role != 'teacher':
                return JsonResponse({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

            if 'profile_image' not in request.FILES:
                return JsonResponse({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

            # Get or create user_info
            user_info, created = UserInfo.objects.get_or_create(user=user)
            if created:
                logger.info(f"Created new UserInfo for user {user.id}")

            # Delete old image if it exists
            if user_info.profile_image:
                if os.path.exists(user_info.profile_image.path):
                    os.remove(user_info.profile_image.path)

            user_info.profile_image = request.FILES['profile_image']
            user_info.save()

            # Build absolute URL for the image
            image_url = request.build_absolute_uri(user_info.profile_image.url)
            logger.info(f"Profile image uploaded successfully. URL: {image_url}")

            return JsonResponse({
                "message": "Image uploaded successfully",
                "image_url": image_url
            })
                
        except Exception as e:
            logger.error(f"Error uploading profile image: {str(e)}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        try:
            user = request.user
            if user.role != 'teacher':
                return JsonResponse({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

            # Get or create user_info
            user_info, created = UserInfo.objects.get_or_create(user=user)
            if created:
                logger.info(f"Created new UserInfo for user {user.id}")
                
            # Delete the physical file if it exists
            if user_info.profile_image:
                if os.path.exists(user_info.profile_image.path):
                    os.remove(user_info.profile_image.path)
                
                # Clear the profile_image field
                user_info.profile_image = None
                user_info.save()
                
                logger.info(f"Profile image deleted successfully for user {user.id}")
                return JsonResponse({
                    "message": "Profile image deleted successfully",
                    "status": "success"
                })
            else:
                return JsonResponse({
                    "message": "No profile image to delete",
                    "status": "success"
                })
                
        except Exception as e:
            logger.error(f"Error deleting profile image: {str(e)}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)