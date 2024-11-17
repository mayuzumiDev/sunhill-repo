from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from api.models import CustomUser
from ..serializers.current_admin_serializers import *

class CurrentAdminView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CurrentAdminSerializer

    def get_object(self, queryset=None):
        user = self.request.user
        if not user.is_authenticated:
            raise ValidationError("User is not authenticated")
        return user

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user)
        return JsonResponse({'message': 'Current admin retrieved successfully', 
                             'current_admin': serializer.data}, status=status.HTTP_200_OK)
