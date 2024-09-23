from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import AdminLoginSerializer

class AdminLoginView(APIView):
    permission_classes = [AllowAny]  # Allow access without authentication

    def post(self, request, *args, **kwargs):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                if user.is_staff: 
                    refresh = RefreshToken.for_user(user)
                    login(request, user)
                    return Response({
                        "success": True, "token": str(refresh.access_token),  "message": "Admin login successful"}, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Not an admin user"}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
""" from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt, csrf_protect, requires_csrf_token
import json

def validate_credentials(request, username, password):
    user = authenticate(request=request, username=username, password=password)

    print("\nValidating Credentials...");

    if user is not None and user.is_superuser:
        print("\nValid Credentials...");
        print("\nUser object:", user)
        login(request, user)
        return True
    else:
        print("\nInvalid Credentials...");
        return False
    
@csrf_protect
def admin_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            print("\nReceived credentials:", username, password);
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Invalid JSON format"}, status=400)
    
        if validate_credentials(request, username, password):
            print("\nSending response...");
            return JsonResponse({'success': True}, content_type='application/json', status=200)
        else:
            return JsonResponse({'success': False})

    else:
        return JsonResponse({'success': False, "message": "Invalid request method"}, status=405)


@csrf_protect
def admin_logout(request):
    
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, "message": "Invalid request method"}, status=405)
 """