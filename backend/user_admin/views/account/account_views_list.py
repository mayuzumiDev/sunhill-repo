from django.http.response import JsonResponse
from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from ...models.account_models import UserInfo
from ...serializers.accounts.list_account_serializers import *

class TeacherListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TeacherListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['id', 'user__first_name', 'user__last_name']
    ordering_fields = ['user__first_name']
    ordering = ['-user__date_joined']

    # Returns a queryset of UserInfo objects where the user's role is 'teacher'
    def get_queryset(self):
        query_set = UserInfo.objects.filter(user__role='teacher').order_by(*self.ordering)
        return query_set 

    # Handles GET requests and returns a JSON response with the list of teachers
    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        teacher_list = serializer.data
        
        return JsonResponse({'message': 'Teacher list retrieved successfully', 
                             'teacher_list': teacher_list
                             }, status=status.HTTP_200_OK)