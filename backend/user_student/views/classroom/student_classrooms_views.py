from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, generics

from user_teacher.models.classroom_models import ClassRoomStudent
from user_student.serializers.classroom.student_classrooms_serializers import StudentClassroomListSerializer
from user_admin.models.account_models import StudentInfo

class StudentEnrolledClassroomsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentClassroomListSerializer

    def get_queryset(self):
        # student_id = self.kwargs.get('student_id') # Must be remove for testing only
        try:
            # # Get the student info associated with the current user
            student_info = StudentInfo.objects.get(student_info__user__id=self.request.user.id)

            # student_info = StudentInfo.objects.get(id=student_id) # Must be remove for testing only
            
            # Get all active enrollments for this student
            return ClassRoomStudent.objects.filter(
                student=student_info,
                is_active=True
            ).select_related('classroom', 'classroom__class_instructor')
            
        except StudentInfo.DoesNotExist:
            return ClassRoomStudent.objects.none()

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            if not queryset.exists():
                return Response({
                    "status": "error",
                    "message": "No enrolled classrooms found.",
                    "data": []
                }, status=status.HTTP_404_NOT_FOUND)
            
            serializer = self.get_serializer(queryset, many=True)
            return Response({
                "status": "success",
                "message": "Classrooms retrieved successfully",
                "student_classrooms": serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "status": "error",
                "message": str(e),
                "data": None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)