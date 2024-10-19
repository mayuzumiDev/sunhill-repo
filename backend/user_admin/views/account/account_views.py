from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.models import CustomUser
from ...serializers.account_serializers import CreateAcountSerializer

class CreateAccountView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = CreateAcountSerializer
    queryset = CustomUser.objects.all()

    def create(self, request, *args, **kwargs):
        account_count = request.data.get('account_count', 1)
        generated_users = []

        for _ in range(account_count):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            generated_users.append({'username': user['generated_username'], 'password': user['generated_password']})

        for user in generated_users:
            print(f"Username: {user['username']}, Password: {user['password']}")

        return JsonResponse({'message': 'Account generated successfully', 'generated_users': generated_users}, status=status.HTTP_201_CREATED)
    
