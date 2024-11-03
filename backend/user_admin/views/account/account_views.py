from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.exceptions import ValidationError
from api.models import CustomUser
from ...models.account_models import UserInfo
from ...serializers.account_serializers import *

class GenerateAccountView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = CreateAccountSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        account_storage = []
        account_count = serializer.validated_data.get('account_count', 1)
        role = serializer.validated_data.get('role')
        branch_name = serializer.validated_data.get('branch_name')

        if not isinstance(account_count, int)  or account_count <= 0:
            raise ValidationError({"account_count": "Must be a positive integer"})
        
        for  _ in range(account_count):
            account_data = serializer.generate_account(serializer.validated_data)
            account_storage.append({
                'username': account_data['generated_username'],
                'password': account_data['generated_password'],
                'role': role,
                'branch_name': branch_name
            })
        
        print("Account Storage: ", account_storage)
        return JsonResponse({'accounts':  account_storage}, status=status.HTTP_201_CREATED)

class CreateAccountView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = CreateAccountSerializer
    queryset = CustomUser.objects.all()

    def post(self, request):
        print("Request data: ", request.data)
        generated_accounts = request.data.get("accounts", []) 
        print("Generated Accounts: ", generated_accounts)
        response_data = []

        for generated_account in generated_accounts:
            serializer_data = {
                'role': generated_account.get('role'),
                'branch_name': generated_account.get('branch_name'),
                'generated_username': generated_account.get('username'),
                'generated_password': generated_account.get('password'),
            }
            serializer = self.get_serializer(data=serializer_data)
            print("Serializer Data:", serializer_data)  # Print data before validation

            if serializer.is_valid():
                user = serializer.save()
                user_data = self.get_serializer(user).data
            
                account_data = {
                    'message':  f'{user.role} account created successfully',
                    'user': user_data,
                    'username':  generated_account['username'],
                    'password': generated_account['password']
                }

                print("Account Data: ", account_data)

                if user.role == 'student':
                    parent_data = {
                        'student_username': generated_account['username']
                    }
                    parent_link_serializer = ParentStudentLinkSerializer(data=parent_data)
                    parent_link_serializer.is_valid(raise_exception=True)
                    parent_user = parent_link_serializer.save()

                    account_data.update({
                        'parent_username': parent_user['generated_username'],
                        'parent_password': parent_user['generated_password'],
                        'linked_student': user.username
                    })
                
                response_data.append(account_data)

                print("Response Data: ", response_data)
            
            else:
                print("Serializer Errors:", serializer.errors)  # Print errors if not valid 
                return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return JsonResponse({'accounts': response_data}, status=status.HTTP_201_CREATED)

class TeacherListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TeacherListSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    SearchFilter = ['id']
    OrderingFilter = ['branch_name']

    # Returns a queryset of UserInfo objects where the user's role is 'teacher'
    def get_queryset(self):
        query_set = UserInfo.objects.filter(user__role='teacher')
        return query_set 

    # Handles GET requests and returns a JSON response with the list of teachers
    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        teacher_list = serializer.data
        
        return JsonResponse({'message': 'Teacher list retrieved successfully', 
                             'teacher_list': teacher_list
                             }, status=status.HTTP_200_OK)
