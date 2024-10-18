from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.models import CustomUser
from user_admin.serializers import CreateAcountSerializer

class CreateAccountView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = CreateAcountSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return JsonResponse({'message': 'Account created successfully', 'user_id': user.id}, status=status.HTTP_201_CREATED)