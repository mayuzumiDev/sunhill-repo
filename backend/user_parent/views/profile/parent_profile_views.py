from django.http import JsonResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from user_admin.models.account_models import CustomUser, UserInfo, ParentInfo
import os
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class ParentProfileImageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        try:
            user = request.user
            if user.role != 'parent':
                return JsonResponse({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

            user_info = request.user.user_info
            if user_info and user_info.profile_image:
                image_url = request.build_absolute_uri(user_info.profile_image.url)
                return JsonResponse({
                    'profile_image': image_url
                })
            return JsonResponse({'profile_image': None})
                
        except Exception as e:
            logger.error(f"Error retrieving profile image: {str(e)}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request):
        try:
            user = request.user
            if user.role != 'parent':
                return JsonResponse({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

            if 'profile_image' not in request.FILES:
                return JsonResponse({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

            # Get or create user_info
            user_info, created = UserInfo.objects.get_or_create(user=user)
            if created:
                logger.info(f"Created new UserInfo for user {user.id}")

            # Delete old image if it exists
            if user_info.profile_image:
                try:
                    if os.path.exists(user_info.profile_image.path):
                        os.remove(user_info.profile_image.path)
                except Exception as e:
                    logger.warning(f"Error deleting old image: {str(e)}")

            # Save new image
            user_info.profile_image = request.FILES['profile_image']
            user_info.save()

            # Build absolute URL for the image
            image_url = request.build_absolute_uri(user_info.profile_image.url)
            logger.info(f"Profile image uploaded successfully. URL: {image_url}")

            return JsonResponse({
                "message": "Profile image updated successfully",
                "profile_image": image_url
            })
                
        except Exception as e:
            logger.error(f"Error uploading profile image: {str(e)}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        try:
            user = request.user
            if user.role != 'parent':
                return JsonResponse({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

            user_info = request.user.user_info
            if not user_info:
                return JsonResponse({"error": "User info not found"}, status=status.HTTP_404_NOT_FOUND)

            if user_info.profile_image:
                try:
                    # Delete the physical file
                    if os.path.exists(user_info.profile_image.path):
                        os.remove(user_info.profile_image.path)
                except Exception as e:
                    logger.warning(f"Error deleting image file: {str(e)}")
                
                # Clear the field
                user_info.profile_image = None
                user_info.save()
                
                logger.info(f"Profile image deleted successfully for user {user.id}")
                return JsonResponse({
                    "message": "Profile image deleted successfully",
                    "status": "success"
                })
            
            return JsonResponse({
                "message": "No profile image to delete",
                "status": "success"
            })
                
        except Exception as e:
            logger.error(f"Error deleting profile image: {str(e)}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
