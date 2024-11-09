from django.http.response import JsonResponse
from django.db.models import Q
from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from ...models.account_models import UserInfo
from ...serializers.accounts.list_account_serializers import *

class TeacherListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TeacherListSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__first_name', 'user__last_name']

    def get_queryset(self):
        queryset = UserInfo.objects.filter(user__role='teacher')
        search_term = self.request.query_params.get('search', None)
        if search_term:
            search_term = search_term.lower()
            query = Q()
            for i in range(1, len(search_term) + 1):
                substring = search_term[:i]
                query &= Q(user__first_name__istartswith=substring) | Q(user__last_name__istartswith=substring)
            queryset = queryset.filter(query)
        return queryset

    # Handles GET requests and returns a JSON response with the list of teachers
    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        teacher_list = serializer.data
        
        return JsonResponse({'message': 'Teacher list retrieved successfully', 
                             'teacher_list': teacher_list
                             }, status=status.HTTP_200_OK)