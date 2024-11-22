from django.http.response import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from user_teacher.models.classroom_models import ClassRoomStudent
from user_teacher.serializers.classroom.classroom_student_serializers import *

class AddStudentToClassroomView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddStudentToClassroomSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return JsonResponse({
                'status': 'success',
                'message': 'Student added to classroom successfully',
                'classroom_student': serializer.data
            }, status=status.HTTP_201_CREATED)

        return JsonResponse({
            'status': 'error',
            'message': 'Failed to add student to classroom',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save()

class ClassroomStudentDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ClassRoomStudent.objects.all()

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)

            return JsonResponse({
                'message': 'Classroom deleted successfully'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class ClassroomStudentListView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ClassroomStudentListSerializer

    def list(self, request, *args, **kwargs):
        classroom_id = request.query_params.get('classroom_id')
        if not classroom_id:
            return JsonResponse({
                'status': 'error',
                'message': 'Classroom ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        queryset = ClassRoomStudent.objects.filter(
            classroom_id=classroom_id
        ).select_related('student')
        
        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse({
            'status': 'success',
            'message': 'Students retrieved successfully',
            'classroom_student_list': serializer.data
        }, status=status.HTTP_200_OK)