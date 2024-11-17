from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from api.models import CustomUser
from ...serializers.accounts.create_account_serializers import *

class GenerateAccountView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateAccountSerializer

    def post(self, request):
        # Handle POST request to generate accounts.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        account_storage = []  # List to store generated account details.
        account_count = serializer.validated_data.get('account_count', 1)
        role = serializer.validated_data.get('role')
        branch_name = serializer.validated_data.get('branch_name')

        if not isinstance(account_count, int)  or account_count <= 0:
            raise ValidationError({"account_count": "Must be a positive integer"})
        
         # Loop to create the specified number of accounts.
        for  _ in range(account_count): 
            account_data = serializer.generate_account(serializer.validated_data)
            account_storage.append({
                'username': account_data['generated_username'],
                'password': account_data['generated_password'],
                'parent_username': account_data['parent_username'],
                'parent_password': account_data['parent_password'],
                'role': role,
                'branch_name': branch_name
            })
        
        return JsonResponse({'accounts':  account_storage}, status=status.HTTP_201_CREATED)

class CreateAccountView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateAccountSerializer
    queryset = CustomUser.objects.all()

    def post(self, request):
         # Handle POST request to create user accounts.
        generated_accounts = request.data.get("accounts", []) 
        response_data = []

        # Loop through each generated account and create it.
        for generated_account in generated_accounts:
            serializer_data = {
                'role': generated_account.get('role'),
                'branch_name': generated_account.get('branch_name'),
                'generated_username': generated_account.get('username'),
                'generated_password': generated_account.get('password'),
            }
            serializer = self.get_serializer(data=serializer_data)

            if serializer.is_valid():
                user = serializer.save()
                user_data = self.get_serializer(user).data
            
                account_data = {
                    'message':  f'{user.role} account created successfully',
                    'user': user_data,
                    'username':  generated_account['username'],
                    'password': generated_account['password']
                }

                # If the user is a student, create a linked parent account.
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

            else:
                print("Serializer Errors:", serializer.errors)  # Print errors if not valid 
                return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return JsonResponse({'accounts': response_data}, status=status.HTTP_201_CREATED)

class CustomUserDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def post(self, request, *args, **kwargs):
        # Handle POST request to delete user accounts.
        user_ids = request.data.get('id')

        if not user_ids:
            return JsonResponse({"error": "User IDs is required."}, status=status.HTTP_400_BAD_REQUEST)

        deleted_count = 0
        # Loop through each user ID to attempt deletion.
        for user_id in user_ids:
            try:
                user = CustomUser.objects.get(pk=user_id)

                if user.role == 'student':
                    try:
                        user_info_instance = user.user_info # Get the user_info instance associated with the student user.
                        student_info_instance = user_info_instance.student_info # Get the student_info instance associated with the user_info
                        parent_infos = student_info_instance.parent_student.all() # Retrieve all parent_info instances associated with the student_info.

                        parent_infos_count = len(parent_infos)
                        print(f"\nNumber of parent info instances associated with the student: {parent_infos_count}\n")
                        
                        for parent_info in parent_infos: 
                            
                            if parent_infos_count == 1:
                                parent_user = parent_info.parent_info.user  # Get the parent user associated with the parent_info.
                                parent_user.delete()

                    except StudentInfo.DoesNotExist:
                        pass
                
                elif user.role == 'parent':
                    try:
                        user_info_instance = user.user_info # Get the user_info instance associated with the parent user.
                        parent_info = user_info_instance.parent_info # Get the parent_info instance associated with the user_info.
                        students = parent_info.student_info.all()

                        for student in students:
                            student_user = student.student_info.user  # Get the student user associated with the student_info.
                            student_user.delete()

                    except ParentInfo.DoesNotExist:
                        pass                        

                user.delete()
            except CustomUser.DoesNotExist:
              pass
        
        return JsonResponse({"success": "User deleted successfully."}, status=status.HTTP_200_OK)




