from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from user_admin.models.account_models import ParentInfo, StudentInfo, UserInfo
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count, Case, When, IntegerField, F, Avg
from user_teacher.models.quizzes_models import QuizScore, Question
from user_teacher.models.classroom_models import *

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


def calculate_class_statistics(quiz_scores):
    if not quiz_scores:
        return None
    
    scores = [float(score.percentage_score) for score in quiz_scores]
    scores.sort()
    
    n = len(scores)
    q1_idx = int(n * 0.25)
    q2_idx = int(n * 0.5)
    q3_idx = int(n * 0.75)
    
    return {
        'min': min(scores),
        'q1': scores[q1_idx],
        'median': scores[q2_idx],
        'q3': scores[q3_idx],
        'max': max(scores),
        'avg': sum(scores) / n
    }

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def peer_benchmarking(request):
    try:
        # Get the parent info and their student
        parent_info = request.user.user_info.parent_info
        student = parent_info.student_info.first()  # Get the first linked student

        if not student:
            return JsonResponse({
                'success': False,
                'error': 'No student linked to parent account'
            }, status=404)

        # Get all classrooms for the student
        classrooms = Classroom.objects.filter(enrolled_students__student=student)

        benchmarking_data = {}
        for classroom in classrooms:
            # Get all quiz scores for this classroom
            classroom_scores = QuizScore.objects.filter(classroom=classroom)

            # Get student's scores
            student_scores = classroom_scores.filter(student=student)

            quizzes_data = {}
            for quiz in classroom.quizzes.all():
                quiz_scores = classroom_scores.filter(quiz=quiz)
                student_score = student_scores.filter(quiz=quiz).first()

                if not quiz_scores.exists():
                    continue

                stats = calculate_class_statistics(quiz_scores)
                if not stats:
                    continue

                # Calculate student's percentile
                if student_score:
                    score_value = float(student_score.percentage_score)
                    scores_below = quiz_scores.filter(percentage_score__lt=score_value).count()
                    percentile = (scores_below / quiz_scores.count()) * 100
                else:
                    score_value = None
                    percentile = None

                quizzes_data[quiz.id] = {
                    'quiz_title': quiz.title,
                    'class_statistics': stats,
                    'student_score': score_value,
                    'student_percentile': percentile,
                    'total_students': quiz_scores.count()
                }

            if quizzes_data:
                benchmarking_data[classroom.id] = {
                    'classroom_name': f"{classroom.grade_level} - {classroom.class_section}",
                    'subject': classroom.subject_name,
                    'quizzes': quizzes_data
                }

        return JsonResponse({
            'success': True,
            'data': benchmarking_data
        })

    except ObjectDoesNotExist as e:
        return JsonResponse({
            'success': False,
            'error': 'Parent or student information not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


