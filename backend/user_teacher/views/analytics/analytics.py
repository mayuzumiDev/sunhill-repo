from django.db.models import Count
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from user_teacher.models.quizzes_models import *
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated

import logging
logger = logging.getLogger(__name__)

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
        performance_data = {
            'single': {'correct': 0, 'total': 0},
            'multi': {'correct': 0, 'total': 0},
            'identification': {'correct': 0, 'total': 0},
            'true_false': {'correct': 0, 'total': 0}
        }
        
        questions = Question.objects.prefetch_related('choices').all()
        questions_dict = {str(q.id): q for q in questions}
        
        # Debug: Print all questions and their types
        print("\nAll questions:")
        for q in questions:
            print(f"Q{q.id}: Type={q.question_type}, Text={q.text}")
            if q.question_type == 'true_false':
                correct = q.choices.filter(is_correct=True).first()
                print(f"  Correct choice: {correct.text if correct else 'None'}")
            elif q.question_type == 'identification':
                print(f"  Correct answer: {q.correct_answer}")
        
        correct_answers = {}
        for q in questions:
            if q.question_type == 'true_false':
                correct_choice = q.choices.filter(is_correct=True).first()
                if correct_choice:
                    # Store the actual text value from the choice
                    correct_answers[str(q.id)] = correct_choice.text.lower()
                    print(f"True/False Q{q.id}: Stored correct answer: {correct_answers[str(q.id)]}")
            elif q.question_type == 'single':
                correct_choice = q.choices.filter(is_correct=True).first()
                if correct_choice:
                    correct_answers[str(q.id)] = str(correct_choice.id)
            elif q.question_type == 'identification':
                if q.correct_answer:
                    correct_answers[str(q.id)] = ''.join(q.correct_answer.lower().strip().split())
                    print(f"Identification Q{q.id}: Stored correct answer: {correct_answers[str(q.id)]}")
        
        correct_multi_choices = {
            str(q.id): set(str(x) for x in q.choices.filter(is_correct=True).values_list('id', flat=True))
            for q in questions 
            if q.question_type == 'multi'
        }

        student_responses = StudentResponse.objects.all()
        print("\nProcessing responses...")

        for response in student_responses:
            print(f"\nResponse {response.id}:")
            for question_id, answer in response.responses.items():
                question = questions_dict.get(question_id)
                if not question or question.question_type not in performance_data:
                    continue
                    
                q_type = question.question_type
                performance_data[q_type]['total'] += 1
                
                if q_type == 'true_false':
                    # Keep the answer as is, just normalize case
                    student_answer = str(answer).lower()
                    correct_answer = correct_answers.get(question_id)
                    
                    print(f"True/False Q{question_id}:")
                    print(f"  Student answer: '{student_answer}'")
                    print(f"  Correct answer: '{correct_answer}'")
                    print(f"  Answer type: {type(answer)}")
                    
                    if student_answer and correct_answer:
                        if student_answer == correct_answer:
                            performance_data[q_type]['correct'] += 1
                            print("  Result: CORRECT")
                        else:
                            print("  Result: INCORRECT")
                
                elif q_type == 'single':
                    correct_choice = correct_answers.get(question_id)
                    if answer and str(answer) == correct_choice:
                        performance_data[q_type]['correct'] += 1
                        
                elif q_type == 'multi':
                    if answer:
                        student_choices = set(str(x) for x in answer)
                        correct_choices = correct_multi_choices.get(question_id, set())
                        if student_choices == correct_choices:
                            performance_data[q_type]['correct'] += 1
                        
                elif q_type == 'identification':
                    if answer:
                        student_answer = ''.join(str(answer).lower().strip().split())
                        correct_answer = correct_answers.get(question_id)
                        
                        print(f"Identification Q{question_id}:")
                        print(f"  Student answer: '{student_answer}'")
                        print(f"  Correct answer: '{correct_answer}'")
                        print(f"  Answer type: {type(answer)}")
                        
                        if correct_answer:
                            if student_answer == correct_answer:
                                performance_data[q_type]['correct'] += 1
                                print("  Result: CORRECT")
                            else:
                                print("  Result: INCORRECT")

        print("\nFinal performance data:", performance_data)

        chart_data = {
            'labels': [],
            'datasets': [{
                'data': [],
                'label': 'Average Performance (%)'
            }]
        }
        
        for q_type, data in performance_data.items():
            if data['total'] > 0:
                chart_data['labels'].append(q_type)
                percentage = (data['correct'] / data['total']) * 100
                chart_data['datasets'][0]['data'].append(round(percentage, 1))
        
        return JsonResponse(chart_data, safe=False)
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        traceback.print_exc()  # Print full stack trace
        return JsonResponse({'error': str(e)}, status=500)
        
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