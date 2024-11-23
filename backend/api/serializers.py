from rest_framework import serializers
from django.core.validators import MinLengthValidator, MaxLengthValidator
from .models import CustomUser, PasswordResetCode
from user_admin.models.account_models import UserInfo, PublicInfo

class AccountLoginSerializer(serializers.Serializer):
    # Fields required for admin login
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    login_page = serializers.CharField(required=True)

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
        password_reset_codes = PasswordResetCode.objects.filter(user_email=email)

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

class PublicSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'email', 'first_name', 'last_name']
        extra_kwargs = {
            'username': {"required": True},
            'password': {"required": True},
            'email': {"required": True},
            'first_name': {"required": True},
            'last_name': {"required": True}
        }

    def create(self, validated_data):
        # Create CustomUser instance
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.role = 'public'  # Set role as public
        user.save()
        
        try:
            # Create UserInfo instance
            user_info = UserInfo.objects.create(user=user)
            
            # Create PublicInfo instance
            public_info = PublicInfo.objects.create(user_info=user_info)
            
        except Exception as e:
            user.delete()
            raise serializers.ValidationError(f"Error creating user profile: {str(e)}")
            
        return user