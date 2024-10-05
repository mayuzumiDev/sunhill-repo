from rest_framework import serializers
from django.core.validators import MinLengthValidator, MaxLengthValidator
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
    
class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True, validators=[MinLengthValidator(8), MaxLengthValidator(64)], required=True)
    reset_code = serializers.CharField(max_length=4)

    def validate(self, data):
        email = data.get('email') # Get the email from the input data
        user = CustomUser.objects.filter(email=email).first() # Check if a user with this email exists

        if not user:
            raise  serializers.ValidationError({'serializer_email': 'User with this email does not exist.'})
        return data
    
    def update(self, instance, validated_data):
        user = CustomUser.objects.get(email=validated_data['email']) # Get the user object from the database
        user.update(new_password=validated_data['new_password']) # Update the user's password
        return user
    
class OTPResendCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    reset_code = serializers.CharField(max_length=4)

    def validate(self, data):
        email = data.get('email')
        reset_code = data.get('reset_code')
        
        user = CustomUser.objects.filter(email=email).first()

        if not user:
            raise  serializers.ValidationError({'serializer_email': 'User with this email does not exist.'})
        return data