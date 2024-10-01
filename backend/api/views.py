from django.contrib.auth import authenticate, login
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import AdminLoginSerializer, PasswordResetSerializer
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.core.mail import send_mail
from django.utils.html import strip_tags
from .models import CustomUser
import random
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework_simplejwt.settings import api_settings

class AdminLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny] # Allow any user to access this view
   
    def post(self, request, *args, **kwargs):
        serializer = AdminLoginSerializer(data=request.data) # Create serializer instance

        # Check serializer validity
        if serializer.is_valid():
            # Extract the username and password
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')

            # Authenticate user
            user = authenticate(request, username=username, password=password)

            # If user is authenticated
            if user is not None:
                # Check if user is staff
                if user.is_staff: 
                    # Generate tokens and log in
                    refresh_token = RefreshToken.for_user(user)
                    access_token = refresh_token.access_token
                    login(request, user)
                    
                    # Return success response
                    return Response({
                        "success": True, 
                        "access_token": str(access_token), 
                        "refresh_token": str(refresh_token), 
                        "message": "Admin login successful",
                        "role": user.role
                        }, status=status.HTTP_200_OK)
                else:
                    # Return access denied error
                    return Response({"error": "Access Denied: Only administrators are allowed to log in."}, status=status.HTTP_403_FORBIDDEN)
            else:
                # Return invalid credentials error
                return Response({"error": "Invalid username or password. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Return serializer errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminLogoutView(generics.GenericAPIView):  
    permission_classes = [IsAuthenticated]  # Only allow authenticated users

    def post(self, request):
        try:
            # Get refresh token from request
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)

            # Blacklist token to log out
            token.blacklist()

             # Return success response
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [AllowAny]  # Allow any user to access this view
    serializer_class = PasswordResetSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data.get('email')

            # Check if email exists in the database
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)

            verification_code = str(random.randint(1000, 9999))

            # Generate password reset token
            token = RefreshToken.for_user(user)

            # Render the email template with dynamic data
            message_html = render_to_string('api/password_reset_email.html', {
                "user": user,
                "verification_code": verification_code
            })

            # Remove HTML tags from the email template
            message_plain = strip_tags(message_html)

            message = EmailMultiAlternatives(
                subject="Password Reset Request",
                body=message_plain,
                from_email="jdacdummyacc@gmail.com",
                to=[email]
            )

            # Send the email
            try:
                message.attach_alternative(message_html, "text/html")
                message.send()
                print("Email sent successfully!")
            except Exception as e:
                print("Error sending email:", str(e))

            return Response({"success": True, "message": "Password reset email sent successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
