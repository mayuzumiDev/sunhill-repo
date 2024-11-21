from django.http.response import JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import generics, status
from user_teacher.serializers.classroom.classroom_list_serializers import *
from user_teacher.models.classroom_models import *

class ClassroomListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ClassroomListSerializer
    queryset = Classroom.objects.all()

    def get_queryset(self):
        try:
            teacher_info = self.request.user.user_info.teacher_info
            queryset = Classroom.objects.filter(class_instructor=teacher_info)
            
            return queryset
        except Exception as e:
            return Classroom.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        classroom_list = serializer.data

        return JsonResponse({
            'message': 'Classroom list retrieved successfully',
            'classroom_list': classroom_list
        }, status=status.HTTP_200_OK)