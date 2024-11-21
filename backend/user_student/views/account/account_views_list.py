from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from user_admin.models.account_models import CustomUser, UserInfo, StudentInfo
from ...serializers.profile.current_student_serializer import GetCurrentStudentSerializer
import os
import re
import logging

logger = logging.getLogger(__name__)

class GetCurrentStudentView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GetCurrentStudentSerializer

    def get_object(self):
        user = self.request.user
        logger.info(f"Getting student profile for user: {user.id}, username: {user.username}")
        return user

    def retrieve(self, request, *args, **kwargs):
        try:
            user = request.user
            logger.info(f"Starting to retrieve student profile for user_id: {user.id}, username: {user.username}")
            
            if not user.is_authenticated:
                logger.error(f"User is not authenticated")
                return JsonResponse({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
            
            if user.role != 'student':
                logger.warning(f"User {user.id} is not a student. Role: {user.role}")
                return JsonResponse({"error": "Not authorized - user is not a student"}, status=status.HTTP_403_FORBIDDEN)
            
            try:
                # Get or create UserInfo
                user_info, created_user = UserInfo.objects.get_or_create(user=user)
                logger.info(f"UserInfo {'created' if created_user else 'retrieved'} for user {user.id}")
                
                # Get or create StudentInfo
                student_info, created_student = StudentInfo.objects.get_or_create(student_info=user_info)
                logger.info(f"StudentInfo {'created' if created_student else 'retrieved'} for user {user.id}")
                
                serializer = self.serializer_class(user, context={'request': request})
                response_data = {"student_profile": serializer.data}
                logger.info(f"Successfully serialized student profile for user {user.id}")
                return JsonResponse(response_data, status=status.HTTP_200_OK)
                
            except Exception as e:
                logger.error(f"Error processing student profile for user {user.id}: {str(e)}")
                return JsonResponse(
                    {"error": "Error processing student profile", "details": str(e)}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            logger.error(f"Unexpected error retrieving student profile: {str(e)}")
            logger.exception("Full traceback:")
            return JsonResponse(
                {"error": "Error retrieving student profile", "details": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StudentProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def validate_phone_number(self, phone):
        pattern = r'^09\d{9}$'
        return bool(re.match(pattern, phone))

    def patch(self, request):
        try:
            user = request.user
            if user.role != 'student':
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
                user.email = request.data['email']
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
            
            user.save()
            logger.info(f"Profile updated successfully for user {user.id}")

            return JsonResponse({
                "message": "Profile updated successfully",
                "student_profile": GetCurrentStudentSerializer(user, context={'request': request}).data
            })
            
        except Exception as e:
            logger.error(f"Unexpected error updating student profile: {str(e)}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StudentProfileImageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            user = request.user 
            if user.role != 'student':
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

            # Get updated profile data
            serializer = GetCurrentStudentSerializer(user, context={'request': request})
            
            return JsonResponse({
                "message": "Image uploaded successfully",
                "student_profile": serializer.data
            })
                
        except Exception as e:
            logger.error(f"Error uploading profile image: {str(e)}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        try:
            user = request.user
            if user.role != 'student':
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
            
                # Get updated profile data
                serializer = GetCurrentStudentSerializer(user, context={'request': request})
            
            return JsonResponse({
                "message": "Profile image deleted successfully",
                "student_profile": serializer.data
            })
                
        except Exception as e:
            logger.error(f"Error deleting profile image: {str(e)}")
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)