from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user_teacher.models.quizzes_models import Quiz, StudentResponse, QuizScore
from user_teacher.models.classroom_models import Classroom
from user_admin.models.account_models import ParentInfo
from django.db.models import Count
from django.core.exceptions import ObjectDoesNotExist
from ...serializers.metrics.metrics_serializers import MetricsSerializer
from django.utils import timezone

class MetricsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MetricsSerializer

    def get(self, request):
        try:
            print("\n=== MetricsView Debug ===")
            print(f"User ID: {request.user.id}")
            
            # Get the parent info for the current user
            parent_info = request.user.user_info.parent_info
            print(f"Parent Info: {parent_info}")
            
            # Get the linked student (first one for now)
            student = parent_info.student_info.first()
            print(f"Linked Student: {student}")
            
            if not student:
                print("No student found!")
                return Response({
                    'error': 'No student linked to parent account'
                }, status=404)

            # Get all classrooms for the student using the correct relationship
            classrooms = Classroom.objects.filter(
                enrolled_students__student=student
            )
            print(f"Student's Classrooms Count: {classrooms.count()}")
            
            # Get all quizzes from student's classrooms
            all_quizzes = Quiz.objects.filter(classroom__in=classrooms)
            print(f"Total Quizzes in Student's Classrooms: {all_quizzes.count()}")

            # Get completed quizzes (those with responses and scores)
            completed_quiz_ids = QuizScore.objects.filter(
                student=student,
                quiz__in=all_quizzes
            ).values_list('quiz_id', flat=True)
            print(f"Completed Quiz IDs: {list(completed_quiz_ids)}")

            # Get quizzes that the student has responded to
            answered_quiz_ids = StudentResponse.objects.filter(
                student=student,
                quiz__in=all_quizzes
            ).values_list('quiz_id', flat=True)
            print(f"Answered Quiz IDs: {list(answered_quiz_ids)}")

            # Get the current time
            current_time = timezone.now()

            # Now, calculate pending quizzes (quizzes with no response from the student and whose due date has not passed)
            pending_quizzes = all_quizzes.exclude(
                id__in=answered_quiz_ids  # Exclude quizzes the student has answered
            ).filter(
                due_date__gt=current_time  # Include only quizzes where the due date is in the future
            ).count()

            print(f"Pending Quizzes Count: {pending_quizzes}")

            data = {
                'totalAssignments': pending_quizzes,  # Count of unanswered quizzes that are still open
                'upcomingTests': len(completed_quiz_ids),  # You already have this working
                'studentName': f"{student.student_info.user.first_name} {student.student_info.user.last_name}"
            }

            # Serialize the data
            serializer = self.serializer_class(data=data)
            if not serializer.is_valid():
                print(f"Serializer Errors: {serializer.errors}")
                return Response(serializer.errors, status=400)

            print(f"Final Response Data: {serializer.data}")
            print("=== End MetricsView Debug ===\n")

            return Response(serializer.data)

            
        except ObjectDoesNotExist as e:
            print(f"ObjectDoesNotExist Error: {str(e)}")
            return Response({
                'error': 'Parent or student information not found'
            }, status=404)
        except Exception as e:
            print(f"Unexpected Error: {str(e)}")
            print(f"Error Type: {type(e)}")
            return Response({
                'error': str(e)
            }, status=500)
