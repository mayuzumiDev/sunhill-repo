from rest_framework import serializers
from .models import CustomUser, PasswordResetCode

class AdminLoginSerializer(serializers.Serializer):
    # Fields required for admin login
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField() # Email field for password reset

    # Validate email to ensure it exist in the database
    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value
    
class PasswordResetVerifySerializer(serializers.Serializer):
    email = serializers.EmailField() # Email  field for password reset verification
    verification_code = serializers.CharField(max_length=4) # Verification code field for password reset verification

    # Validate email and verification code
    def validate(self, data):
        email = data.get('email')
        verification_code = data.get('verification_code')

        # Get password reset codes for the given email
        password_reset_codes = PasswordResetCode.objects.filter(email__email=email)

        # Check if email exists in password reset codes table
        if not  password_reset_codes.exists():
            raise serializers.ValidationError('Email not found')

        # Check if the verification code is valid
        for password_reset_code in password_reset_codes:
            if password_reset_code.check_verification_code(verification_code):
                return data
            
        raise serializers.ValidationError({'serializer_verification_code': 'Invalid verification code'})