from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
import logging

logger = logging.getLogger(__name__)

class ParentProfileImageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get the parent's profile image URL"""
        try:
            user_info = request.user.user_info
            if user_info and user_info.profile_image:
                return Response({
                    'profile_image': request.build_absolute_uri(user_info.profile_image.url)
                })
            return Response({'profile_image': None})
        except Exception as e:
            logger.error(f"Error retrieving profile image: {str(e)}")
            return Response(
                {'error': 'Failed to retrieve profile image'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request):
        """Update the parent's profile image"""
        try:
            if 'profile_image' not in request.FILES:
                return Response(
                    {'error': 'No image file provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            image_file = request.FILES['profile_image']
            
            # Validate file size (5MB limit)
            if image_file.size > 5 * 1024 * 1024:
                return Response(
                    {'error': 'File size should not exceed 5MB'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate file type
            valid_types = ['image/jpeg', 'image/png', 'image/gif']
            if image_file.content_type not in valid_types:
                return Response(
                    {'error': 'Invalid file type. Please upload JPEG, PNG, or GIF'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user_info = request.user.user_info
            
            # Delete old image if it exists
            if user_info.profile_image:
                old_path = user_info.profile_image.path
                if os.path.exists(old_path):
                    os.remove(old_path)

            # Save new image
            filename = f'profile_images/parent_{request.user.id}_{image_file.name}'
            user_info.profile_image.save(filename, ContentFile(image_file.read()), save=True)

            return Response({
                'profile_image': request.build_absolute_uri(user_info.profile_image.url),
                'message': 'Profile image updated successfully'
            })

        except Exception as e:
            logger.error(f"Error uploading profile image: {str(e)}")
            return Response(
                {'error': 'Failed to upload profile image'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request):
        """Delete the parent's profile image"""
        try:
            user_info = request.user.user_info
            if user_info.profile_image:
                # Delete the file from storage
                if os.path.exists(user_info.profile_image.path):
                    os.remove(user_info.profile_image.path)
                
                # Clear the field
                user_info.profile_image = None
                user_info.save()

            return Response({
                'message': 'Profile image deleted successfully'
            })

        except Exception as e:
            logger.error(f"Error deleting profile image: {str(e)}")
            return Response(
                {'error': 'Failed to delete profile image'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
