from rest_framework import generics, status
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from user_teacher.models.quizzes_models import Quiz
from user_teacher.models.classroom_models import ClassRoomStudent
from user_student.serializers.quizzes.student_quizzes_serializers import *
from django.shortcuts import get_object_or_404
from user_admin.models.account_models import StudentInfo

class StudentQuizListView(generics.ListAPIView):
    serializer_class = StudentQuizListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        print("View is running...")
        try:
            # Get student info from user info
            student = StudentInfo.objects.get(student_info__user=self.request.user)
            print(f"Student: {student}")

            # Get enrolled classrooms
            enrolled_classrooms = ClassRoomStudent.objects.filter(
                student=student,
                is_active=True
            ).values_list('classroom', flat=True)

            print(f"Enrolled Classroom IDs: {list(enrolled_classrooms)}")

            # Get the actual classroom details for better debugging
            classroom_details = Classroom.objects.filter(id__in=enrolled_classrooms)
            for classroom in classroom_details:
                print(f"Enrolled in: Grade {classroom.grade_level} Section {classroom.class_section} - {classroom.subject_name}")

            # Get quizzes from enrolled classrooms
            return Quiz.objects.filter(
                classroom__in=enrolled_classrooms
            ).select_related('classroom')

        except Exception as e:
            print(f"Error getting student quizzes: {str(e)}")
            return Quiz.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse({
            'status': 'success',
            'message': 'Quizzes retrieved successfully',
            'student_quizzes': serializer.data
        }, status=status.HTTP_200_OK)