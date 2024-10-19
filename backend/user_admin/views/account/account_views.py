from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.models import CustomUser
from ...serializers.account_serializers import CreateAccountSerializer, ParentStudentLinkSerializer

class CreateAccountView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = CreateAccountSerializer
    queryset = CustomUser.objects.all()

    # Create multiple user accounts based on the provided account count
    def create(self, request, *args, **kwargs):
        account_count = request.data.get('account_count', 1)
        generated_users = []
        generated_parent_users = []

        for _ in range(account_count):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            generated_users.append({'username': user['generated_username'], 'password': user['generated_password']})

            # If the created user is a student, create a linked parent account
            if user['role'] == 'student':
                parent_data = {
                    'student_username': user['generated_username']
                }
                parent_serializer = ParentStudentLinkSerializer(data=parent_data)
                parent_serializer.is_valid(raise_exception=True)
                parent_account = parent_serializer.save()

                generated_parent_users.append({
                    'username': parent_account['generated_username'],
                    'password': parent_account['generated_password'],
                    'linked_student': user['generated_username']
                })

        for user in generated_users:
            print("User")
            print(f"Username: {user['username']}, Password: {user['password']}")

        for user in generated_users:
            print("Parent")
            print(f"Username: {user['username']}, Password: {user['password']}")

        return JsonResponse({'message': 'Account generated successfully',
                             'generated_users': generated_users,  
                             'generated_parent_users': generated_parent_users}, 
                             status=status.HTTP_201_CREATED)

    
