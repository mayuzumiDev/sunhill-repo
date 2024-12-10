from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from user_admin.models.account_models import ParentInfo, StudentInfo, UserInfo
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count, Case, When, IntegerField, F, Avg
from user_teacher.models.quizzes_models import QuizScore, Question

def calculate_progress(student_user, question_type):
    try:
        # Get the student info object
        student_info = student_user.user_info.student_info
        
        # Get all quiz scores for this student where quizzes have questions of the specified type
        quiz_scores = QuizScore.objects.filter(
            student=student_info,
            quiz__questions__question_type=question_type
        ).distinct()

        if not quiz_scores.exists():
            return 0

        # Calculate average percentage score
        avg_score = quiz_scores.aggregate(
            avg_percentage=Avg('percentage_score')
        )['avg_percentage']

        return float(avg_score) if avg_score is not None else 0

    except Exception as e:
        print(f"Error calculating progress for {question_type}: {str(e)}")
        return 0

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def parent_student_progress(request):
    try:
        # Get the parent info for the current user
        parent_info = request.user.user_info.parent_info
        
        # Get all linked students
        linked_students = parent_info.student_info.all()
        
        # Create the response data structure
        data = {}
        for student in linked_students:
            student_user = student.student_info.user
            # Fetch or calculate the progress data for each question type
            data[str(student_user.id)] = {
                'name': f"{student_user.first_name} {student_user.last_name}",
                'single': calculate_progress(student_user, 'single'),
                'multi': calculate_progress(student_user, 'multi'),
                'identification': calculate_progress(student_user, 'identification'),
                'true_false': calculate_progress(student_user, 'true_false'),
            }
        
        return JsonResponse({
            'success': True,
            'data': data
        })
    except ObjectDoesNotExist as e:
        return JsonResponse({
            'success': False,
            'error': 'Parent information not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)