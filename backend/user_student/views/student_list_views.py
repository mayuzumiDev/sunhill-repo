from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.http import JsonResponse
from rest_framework import status

from user_account.models import CustomUser
from user_student.models import StudentInfo
from user_student.serializers.student_list_serializers import (
    StudentListSerializer,
    StudentInfoEditSerializer
)
from user_account.utils import filter_queryset

class StudentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['id', 'first_name', 'last_name', 'user_info__student_info__grade_level']
    ordering = ['date_joined', 'first_name']
    filterset_fields = ['branch_name']

    def get_queryset(self):
        queryset = CustomUser.objects.filter(role="student")

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
        student_list = serializer.data

        return JsonResponse({
            'message': 'Student list retrieved successfully',
            'student_list': student_list
        }, status=status.HTTP_200_OK)

class StudentInfoEditView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentInfoEditSerializer
    queryset = StudentInfo.objects.all()
    http_method_names = ['patch']

    def partial_update(self, request, pk=None, *args, **kwargs):
        response = super().partial_update(request, pk, *args, **kwargs)
        return JsonResponse({
            'message': 'Student Info updated successfully.'
        }, status=status.HTTP_200_OK)
