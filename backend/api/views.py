from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import AdminLoginSerializer
from .models import CustomUser

class AdminLoginView(APIView):
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
        