from django.db.models import Q
from django.http.response import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from ...models.account_models import UserInfo
from ...serializers.accounts.list_account_serializers import *

def filter_queryset(queryset, params):
    if not params.get('ordering'):
        queryset = queryset.order_by('-date_joined')

    search_term = params.get('search', None)
    if search_term:
        search_term = search_term.lower()
        query = Q()
        for i in range(1, len(search_term) + 1):
            substring = search_term[:i]
            query &= Q(first_name__istartswith=substring) | Q(last_name__istartswith=substring) | Q(id__icontains=substring)
        queryset = queryset.filter(query)

    branch_name = params.get('branch_name', None)
    if branch_name:
        queryset = queryset.filter(branch_name__icontains=branch_name)

    return queryset

class TeacherListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TeacherListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['id', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'first_name']
    filterset_fields = ['branch_name']

    def get_queryset(self):
        queryset = CustomUser.objects.filter(role='teacher')

        params = {
            'ordering': self.request.query_params.get('ordering'),
            'search': self.request.query_params.get('search'),
            'branch_name': self.request.query_params.get('branch_name'),
        }

        queryset = filter_queryset(queryset, params)
        return queryset
    
    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        teacher_list = serializer.data

        return JsonResponse({'message': 'Teacher list retrieved successfully',
                             'teacher_list': teacher_list}, status=status.HTTP_200_OK)


class StudentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['id', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'first_name']
    filterset_fields = ['branch_name']

    def get_queryset(self):
        queryset = CustomUser.objects.filter(role='student')

        params = {
            'ordering': self.request.query_params.get('ordering'),
            'search': self.request.query_params.get('search'),
            'branch_name': self.request.query_params.get('branch_name'),
        }

        queryset = filter_queryset(queryset, params)
        return queryset
    
    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        student_list = serializer.data

        return JsonResponse({
            'message': 'Student list retrieved successfully',
            'student_list': student_list
        }, status=status.HTTP_200_OK)

class ParentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ParentListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['id', 'first_name', 'last_name']
    ordering = ['date_joined', 'first_name']
    filterset_fields = ['branch_name']

    def get_queryset(self):
        queryset = CustomUser.objects.filter(role="parent")

        params = {
            'ordering': self.request.query_params.get("ordering"),
            'search': self.request.query_params.get('search'),
            'branch_name': self.request.query_params.get('branch_name'),
        }

        queryset = filter_queryset(queryset, params)
        return queryset
    
    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        parent_list = serializer.data

        return JsonResponse({'message': 'Parent list retrieved successfully',
                                'parent_list': parent_list}, status=status.HTTP_200_OK)

class PublicUserListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PublicUserListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['id', 'first_name', 'last_name']
    ordering = ['date_joined', 'first_name']

    def get_queryset(self):
        queryset = CustomUser.objects.filter(role="public")

        params = {
            'ordering': self.request.query_params.get('ordering'),
            'search': self.request.query_params.get('search')
        }

        queryset = filter_queryset(queryset, params)
        return queryset

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        public_user_list = serializer.data

        return JsonResponse({'message': 'Public user list retrieved successfully', 
                             'public_user_list': public_user_list}, status=status.HTTP_200_OK)
