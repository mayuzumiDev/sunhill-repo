from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from .models import CustomUser, PasswordResetCode
import random

class AccountLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny] # Allow any user to access this view
    serializer_class = AccountLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')
            login_page = serializer.validated_data.get('login_page')

            # Check if the username exist in the database
            user_exists = CustomUser.objects.filter(username=username).exists();
            if not user_exists:
                return JsonResponse({"error": "Username does not exist"}, status=status.HTTP_404_NOT_FOUND)

            user = authenticate(request, username=username, password=password) # Authenticate user

            # If user is authenticated
            if user is not None:
                if(login_page != user.role):
                    return JsonResponse({"error": f"No {login_page} account found with those credentials"}, status=status.HTTP_403_FORBIDDEN)
                
                # Generate tokens and log in
                refresh_token = RefreshToken.for_user(user);
                access_token = refresh_token.access_token
                login(request, user)

                response_data = {
                    "success": True, 
                    "access_token": str(access_token), 
                    "refresh_token": str(refresh_token), 
                    "role": user.role
                }

                return JsonResponse(response_data, status=status.HTTP_200_OK)
            else:
                return JsonResponse({"error": "Invalid username or password. Please try again"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccountLogoutView(generics.GenericAPIView):  
    permission_classes = [IsAuthenticated]  # Only allow authenticated users

    def post(self, request):
        try:
            # Get refresh token from request
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)

            # Blacklist token to log out
            token.blacklist()

             # Return success JsonResponse
            return JsonResponse({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [AllowAny]  
    serializer_class = PasswordResetSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data.get('email')

            if PasswordResetCode.objects.filter(user_email=email).exists():
                PasswordResetCode.objects.filter(user_email=email).delete()

            # Check if email exists in the database
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                # Return an error JsonResponse if the email is not found
                return JsonResponse({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)

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
                from_email="sunhilllms.dev@gmail.com",
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

            return JsonResponse({"success": True, "message": "Password reset email sent successfully", "verification_code": verification_code},  status=status.HTTP_200_OK)

        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def storeVerifcationCode(self, email, verification_code):
        user = get_object_or_404(CustomUser, email=email)
        # Create a new instance of the PasswordResetCode model
        password_reset_code = PasswordResetCode(
            user=user,
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
            password_reset_code = PasswordResetCode.objects.filter(user_email=email).first()

            # If a password reset code is found
            if password_reset_code:

                # Check if the verification code is valid
                if password_reset_code.check_verification_code(verification_code):
                    return JsonResponse({'message': 'Verification code is valid'}, status=status.HTTP_200_OK)
                else:
                    return JsonResponse({'message': 'Invalid 4-digit verification code'}, status=status.HTTP_400_BAD_REQUEST)
                
            else:
                return JsonResponse({'message': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class PasswordResetConfirm(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            email = request.data.get("email")
            new_password = request.data.get("new_password")
            reset_code = request.data.get("reset_code")

            # Check if a password reset code with the given code exists
            if PasswordResetCode.objects.filter(code=reset_code).exists():

                # Get the password reset code object
                password_reset = get_object_or_404(PasswordResetCode, code=reset_code)

                # Get the user object associated with the given email
                user = get_object_or_404(CustomUser, email=email)

                # Set the new password for the user
                user.set_password(new_password)
                user.save()

                # Delete the password reset code from the PasswordResetCode  model
                password_reset.delete()

                return JsonResponse({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
        
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class OTPCodeResend(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = OTPResendCodeSerializer

    def storeVerifcationCode(self, email, verification_code):
        # Create a new instance of the PasswordResetCode model
        password_reset_code = PasswordResetCode(
            email=CustomUser.objects.get(email=email),
            code=verification_code
        )

        password_reset_code.save()  # Save the instance to the database

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            email =  request.data.get("email")
            reset_code = request.data.get("reset_code")

            if PasswordResetCode.objects.filter(email=email).exists():
                PasswordResetCode.objects.filter(email=email).delete()

            # Check if email exists in the database
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                # Return an error JsonResponse if the email is not found
                return JsonResponse({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)
            
            verification_code = str(random.randint(1000, 9999)) # Generate a passowrd reset token

            self.storeVerifcationCode(email, verification_code)  # Store the verifcation code and email in the database

            # Render the email template with dynamic data
            message_html = render_to_string('api/password_reset_email.html', {
                "user": user,
                "verification_code": verification_code
            })

            message_plain = strip_tags(message_html) # Remove HTML tags from the email template

            message = EmailMultiAlternatives(
                subject="Password Reset Request",
                body=message_plain,
                from_email="sunhilllms.dev@gmail.com",
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

            return JsonResponse({"success": True, "message": "OTP resend successfully", "verification_code": verification_code}, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublicSignUpView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = PublicSignUpSerializer
    queryset = CustomUser.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'message': 'User registered successfully',
                # 'tokens': {
                #     'refresh': str(refresh),
                #     'access': str(refresh.access_token),
                # },
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role
                }
            }, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)