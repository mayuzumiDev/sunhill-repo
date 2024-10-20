from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from api.models import CustomUser
from ...models.account_models import UserInfo
from ...serializers.account_serializers import *

class CreateAccountView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = CreateAccountSerializer
    queryset = CustomUser.objects.all()

    # Create multiple user accounts based on the provided account count
    def create(self, request, *args, **kwargs):
        account_count = int(request.data.get('account_count', 1))
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

        return JsonResponse({'message': 'New accounts created successfully.',
                             'generated_users': generated_users,  
                             'generated_parent_users': generated_parent_users
                            }, status=status.HTTP_201_CREATED)

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
