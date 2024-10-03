from django.contrib.auth import authenticate, login
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import AdminLoginSerializer, PasswordResetSerializer, PasswordResetVerifySerializer
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from .models import CustomUser, PasswordResetCode
import random

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
    permission_classes = [AllowAny]  
    serializer_class = PasswordResetSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data.get('email')

            # Check if email exists in the database
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                # Return an error response if the email is not found
                return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)

            verification_code = str(random.randint(1000, 9999)) # Generate a passowrd reset token

            self.storeVerifcationCode(email, verification_code)  # Store the verifcation code and email in the database

            token = RefreshToken.for_user(user) # Generate password reset token

            # Render the email template with dynamic data
            message_html = render_to_string('api/password_reset_email.html', {
                "user": user,
                "verification_code": verification_code
            })

            message_plain = strip_tags(message_html) # Remove HTML tags from the email template

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
                print("Code: ",  verification_code)

            except Exception as e:
                print("Error sending email:", str(e))

            return Response({"success": True, "message": "Password reset email sent successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def storeVerifcationCode(self, email, verification_code):
        # Create a new instance of the PasswordResetCode model
        password_reset_code = PasswordResetCode(
            email=CustomUser.objects.get(email=email),
            code=verification_code
        )

        password_reset_code.save()  # Save the instance to the database

class PasswordResetVerify(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetVerifySerializer

    def post(self, request):
        # Create a serializer instance with the request data
        serializer = self.get_serializer(data=request.data) 

        # Check if the serializer is valid
        if serializer.is_valid():
            # Get the email and verification code
            email = request.data.get("email")
            verification_code = request.data.get("verification_code")

            # Find the password reset code associated with the email
            password_reset_code = PasswordResetCode.objects.filter(email__email=email).first()

            # If a password reset code is found
            if password_reset_code:

                # Check if the verification code is valid
                if password_reset_code.check_verification_code(verification_code):
                    return Response({'message': 'Verification code is valid'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'Invalid 4-digit verification code'}, status=status.HTTP_400_BAD_REQUEST)
                
            else:
                return Response({'message': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)