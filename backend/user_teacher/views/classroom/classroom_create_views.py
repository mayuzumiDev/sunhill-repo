from django.http.response import JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import generics, status
from user_teacher.serializers.classroom.classroom_create_serializers import *
from user_teacher.models.classroom_models import *

class ClassroomCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ClassroomCreateSerializer
    queryset = Classroom.objects.all();

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            classroom_created = serializer.data

            return Response({'classroom_created': classroom_created}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)