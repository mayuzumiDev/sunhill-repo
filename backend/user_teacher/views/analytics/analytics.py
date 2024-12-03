from django.db.models import Count
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from user_teacher.models.quizzes_models import *
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated

@require_http_methods(["GET"])
def question_type_distribution(request):
    distribution = Question.objects.values('question_type')\
        .annotate(count=Count('id'))\
        .order_by('question_type')
    
    # Convert the query results to the format needed for Chart.js
    labels = [item['question_type'] for item in distribution]
    data = [item['count'] for item in distribution]
    
    chart_data = {
        'labels': labels,
        'datasets': [{
            'data': data,
            'backgroundColor': [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0'
            ]
        }]
    }
    
    return JsonResponse(chart_data, safe=False)


@api_view(['GET'])
def question_type_performance(request):
    try:
        # Initialize performance tracking
        performance_data = {
            'single': {'correct': 0, 'total': 0},
            'multi': {'correct': 0, 'total': 0},
            'identification': {'correct': 0, 'total': 0},
            'true_false': {'correct': 0, 'total': 0}
        }
        
        # Get all student responses without teacher filter
        student_responses = StudentResponse.objects.all()
        
        # Get all questions
        questions = Question.objects.all()
        
        # Calculate performance for each response
        for response in student_responses:
            for question_id, answer in response.responses.items():
                try:
                    question = questions.get(id=question_id)
                    q_type = question.question_type
                    
                    if q_type in performance_data:
                        performance_data[q_type]['total'] += 1
                        
                        # Check if answer is correct based on question type
                        if q_type in ['single', 'true_false']:
                            if str(answer) == str(question.correct_answer):
                                performance_data[q_type]['correct'] += 1
                        elif q_type == 'multi':
                            # For multi-choice, answer should be a list of selected choices
                            correct_choices = set(question.choices.filter(is_correct=True).values_list('id', flat=True))
                            if set(answer) == correct_choices:
                                performance_data[q_type]['correct'] += 1
                        elif q_type == 'identification':
                            # Case-insensitive comparison for identification
                            if str(answer).lower().strip() == str(question.correct_answer).lower().strip():
                                performance_data[q_type]['correct'] += 1
                                
                except Question.DoesNotExist:
                    continue
        
        # Calculate percentages and prepare response data
        labels = []
        performance_percentages = []
        
        for q_type, data in performance_data.items():
            if data['total'] > 0:
                labels.append(q_type)
                percentage = (data['correct'] / data['total']) * 100
                performance_percentages.append(round(percentage, 1))
        
        chart_data = {
            'labels': labels,
            'datasets': [{
                'data': performance_percentages,
                'label': 'Average Performance (%)'
            }]
        }
        
        return JsonResponse(chart_data, safe=False)
        
    except Exception as e:
        return JsonResponse(
            {'error': str(e)},
            status=500
        )

class QuizPassFailRatioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get the teacher info from the authenticated user
            teacher = request.user.user_info.teacher_info

            # Get all quizzes created by this teacher
            quizzes = Quiz.objects.filter(created_by=teacher).order_by('-created_at')
            
            # Initialize the response data
            quiz_statistics = []
            
            for quiz in quizzes:
                # Get pass/fail counts for this quiz
                scores = QuizScore.objects.filter(quiz=quiz)
                passed = scores.filter(status='passed').count()
                failed = scores.filter(status='failed').count()
                
                # Group by classroom
                classroom_stats = (QuizScore.objects
                    .filter(quiz=quiz)
                    .values('classroom__grade_level', 'classroom__class_section')
                    .annotate(
                        passed=Count('id', filter=Q(status='passed')),
                        failed=Count('id', filter=Q(status='failed'))
                    ))
                
                # Format classroom stats with combined name
                formatted_classroom_stats = []
                for stat in classroom_stats:
                    formatted_classroom_stats.append({
                        'classroom_name': f"{stat['classroom__grade_level']} - {stat['classroom__class_section']}",
                        'passed': stat['passed'],
                        'failed': stat['failed']
                    })
                
                quiz_statistics.append({
                    'quiz_id': quiz.id,
                    'quiz_title': quiz.title,
                    'total_passed': passed,
                    'total_failed': failed,
                    'classroom_breakdown': formatted_classroom_stats
                })
            
            return JsonResponse(quiz_statistics, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)