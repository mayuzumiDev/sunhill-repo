from django.db.models import Count, Avg
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from user_teacher.models.quizzes_models import *
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import TruncDate
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response

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


class QuizTimeAnalyticsView(ViewSet):
    def list(self, request):
        quiz_id = request.query_params.get('quiz_id')
        quiz = Quiz.objects.get(id=quiz_id)
        
        # Get submission patterns
        submissions = StudentResponse.objects.filter(quiz=quiz)\
            .annotate(submission_date=TruncDate('submitted_at'))\
            .values('submission_date')\
            .annotate(submission_count=Count('id'))\
            .order_by('submission_date')
        
        return Response({
            'quiz_title': quiz.title,
            'due_date': quiz.due_date,
            'submissions': submissions
        })


class KnowledgeGapAnalyticsView(APIView):
    def get(self, request):
        quiz_id = request.query_params.get('quiz_id')
        
        if not quiz_id:
            return JsonResponse({"error": "Quiz ID is required"}, status=400)
            
        try:
            quiz = Quiz.objects.get(id=quiz_id)
            questions = Question.objects.filter(quiz=quiz)
            
            # Calculate success rate for each question
            question_stats = []
            
            # Get all responses for this quiz
            student_responses = StudentResponse.objects.filter(quiz=quiz)
            print(f"\nAnalyzing quiz {quiz_id}: {quiz.title}")
            print(f"Found {student_responses.count()} student responses")
            
            import json
            
            for question in questions:
                print(f"\nProcessing Question {question.id}: {question.text}")
                print(f"Question type: {question.question_type}")
                print(f"Correct answer: {question.correct_answer}")
                
                correct_count = 0
                total_count = 0
                
                for response in student_responses:
                    try:
                        # Get the response for this specific question
                        responses_data = response.responses
                        print(f"\nRaw response data: {responses_data}")
                        
                        # Ensure we have a dictionary
                        if isinstance(responses_data, str):
                            try:
                                responses_data = json.loads(responses_data)
                                print(f"Parsed JSON data: {responses_data}")
                            except json.JSONDecodeError as e:
                                print(f"JSON decode error for response {response.id}: {str(e)}")
                                continue
                        
                        if not isinstance(responses_data, dict):
                            print(f"Response data is not a dictionary: {type(responses_data)}")
                            continue
                        
                        question_id_str = str(question.id)
                        if question_id_str not in responses_data:
                            print(f"Question {question_id_str} not found in response data")
                            continue
                            
                        question_response = responses_data[question_id_str]
                        print(f"Question response: {question_response}")
                        
                        if isinstance(question_response, str):
                            try:
                                question_response = json.loads(question_response)
                            except json.JSONDecodeError:
                                # If it's a string but not JSON, treat it as the answer itself
                                question_response = question_response
                        
                        if question_response is not None:
                            total_count += 1
                            
                            # Check if the answer is correct based on question type
                            if question.question_type == 'single':
                                try:
                                    # Get the ID of the correct choice from the database
                                    correct_choice = Choice.objects.get(
                                        question=question,
                                        is_correct=True
                                    )
                                    # Convert both to strings and normalize for comparison
                                    student_ans = str(question_response).strip()
                                    correct_ans = str(correct_choice.id)
                                    
                                    is_correct = student_ans == correct_ans
                                    print(f"Single comparison: {student_ans} == {correct_ans} = {is_correct}")
                                    if is_correct:
                                        correct_count += 1
                                except Choice.DoesNotExist:
                                    print(f"No correct choice found for question {question.id}")
                                    continue

                            elif question.question_type == 'true_false':
                                try:
                                    # Handle string or boolean input
                                    if isinstance(question_response, str):
                                        student_ans = question_response.strip().lower()
                                        # Convert 'true'/'false' strings to boolean
                                        student_ans = student_ans == 'true'
                                    else:
                                        # Handle boolean or other types
                                        student_ans = bool(question_response)

                                    # Get correct answer as boolean
                                    correct_ans = str(question.correct_answer).strip().lower() == 'true'
                                    
                                    is_correct = student_ans == correct_ans
                                    print(f"True/False comparison: {student_ans} == {correct_ans} = {is_correct}")
                                    if is_correct:
                                        correct_count += 1
                                except Exception as e:
                                    print(f"Error processing true/false answer: {e}")
                                    continue
                                    
                            elif question.question_type == 'multi':
                                try:
                                    # Parse student answer into a list of choice IDs
                                    if isinstance(question_response, str):
                                        try:
                                            student_answers = json.loads(question_response)
                                        except json.JSONDecodeError:
                                            student_answers = [question_response]
                                    else:
                                        student_answers = question_response if isinstance(question_response, list) else [question_response]
                                    
                                    # Convert all answers to strings
                                    student_choice_ids = set(str(ans).strip() for ans in student_answers)
                                    
                                    # Get correct choice IDs from database
                                    correct_choice_ids = set(str(choice_id) for choice_id in Choice.objects.filter(
                                        question=question,
                                        is_correct=True
                                    ).values_list('id', flat=True))
                                    
                                    print(f"Student choice IDs: {student_choice_ids}")
                                    print(f"Correct choice IDs: {correct_choice_ids}")
                                    
                                    # Check if sets match exactly
                                    is_correct = student_choice_ids == correct_choice_ids
                                    print(f"Multi comparison result: {is_correct}")
                                    
                                    if is_correct:
                                        correct_count += 1
                                except Exception as e:
                                    print(f"Error processing multiple choice answer: {e}")
                                    continue
                                    
                            elif question.question_type == 'identification':
                                try:
                                    # Normalize both answers by:
                                    # 1. Converting to string
                                    # 2. Removing leading/trailing whitespace
                                    # 3. Converting to lowercase
                                    # 4. Removing extra spaces between words
                                    def normalize_text(text):
                                        return ' '.join(str(text).strip().lower().split())

                                    student_ans = normalize_text(question_response)
                                    correct_ans = normalize_text(question.correct_answer)
                                    
                                    is_correct = student_ans == correct_ans
                                    print(f"Identification comparison: '{student_ans}' == '{correct_ans}' = {is_correct}")
                                    if is_correct:
                                        correct_count += 1
                                except Exception as e:
                                    print(f"Error processing identification answer: {e}")
                                    continue
                                    
                    except Exception as e:
                        print(f"Error processing response {response.id} for question {question.id}: {str(e)}")
                        continue
                
                print(f"\nQuestion {question.id} Summary:")
                print(f"Total responses: {total_count}")
                print(f"Correct responses: {correct_count}")
                
                success_rate = (correct_count / total_count * 100) if total_count > 0 else 0
                print(f"Success rate: {success_rate}%")
                
                question_stats.append({
                    'question_id': question.id,
                    'question_text': question.text,
                    'question_type': question.question_type,
                    'success_rate': success_rate,
                    'total_attempts': total_count,
                    'correct_count': correct_count
                })
            
            print(f"\nFinal Stats:")
            for stat in question_stats:
                print(f"Question {stat['question_id']}: {stat['success_rate']}% ({stat['correct_count']}/{stat['total_attempts']})")
                
            return JsonResponse({
                'quiz_title': quiz.title,
                'question_stats': question_stats
            })
            
        except Quiz.DoesNotExist:
            return JsonResponse({"error": "Quiz not found"}, status=404)
        except Exception as e:
            print(f"Error in KnowledgeGapAnalyticsView: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)


class StudentProgressView(APIView):
    def get(self, request):
        try:
            teacher = request.user.user_info.teacher_info
            classrooms = teacher.classrooms.all()
            
            # Get all students from teacher's classrooms
            student_data = {}
            for classroom in classrooms:
                student_responses = StudentResponse.objects.filter(
                    classroom=classroom
                ).select_related(
                    'student',
                    'quiz',
                    'student__student_info',
                    'student__student_info__user'
                )
                
                for response in student_responses:
                    student = response.student
                    student_id = student.id
                    if student_id not in student_data:
                        student_data[student_id] = {
                            'name': f"{student.student_info.user.first_name} {student.student_info.user.last_name}",
                            'single': {'correct': 0, 'total': 0},
                            'multi': {'correct': 0, 'total': 0},
                            'identification': {'correct': 0, 'total': 0},
                            'true_false': {'correct': 0, 'total': 0},
                            'total_attempts': 0
                        }
                    
                    student_data[student_id]['total_attempts'] += 1
                    # Calculate performance per question type
                    quiz_questions = response.quiz.questions.all()
                    for question in quiz_questions:
                        # Increment total questions for this type
                        student_data[student_id][question.question_type]['total'] += 1
                        
                        answer = response.responses.get(str(question.id))
                        if answer is not None:  # Only check if answer was provided
                            is_correct = self._check_answer_correctness(question, answer)
                            if is_correct:
                                student_data[student_id][question.question_type]['correct'] += 1
            
            # Convert raw counts to percentages
            for student_id, data in student_data.items():
                for q_type in ['single', 'multi', 'identification', 'true_false']:
                    total_questions = data[q_type]['total']
                    correct_answers = data[q_type]['correct']
                    
                    # Calculate percentage only if there were questions of this type
                    if total_questions > 0:
                        percentage = (correct_answers / total_questions) * 100
                        data[q_type] = round(percentage, 2)
                    else:
                        data[q_type] = 0  # No questions of this type attempted
                
                # Remove the detailed counts from the response
                data.pop('total_attempts', None)
            
            return JsonResponse({
                'success': True,
                'data': student_data
            })
        except Exception as e:
            print(f"Error in StudentProgressView: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)

    def _check_answer_correctness(self, question, answer):
        if question.question_type == 'single':
            # Get the correct choice ID
            correct_choice = question.choices.filter(is_correct=True).first()
            if correct_choice:
                return str(answer) == str(correct_choice.id)
            return False
        elif question.question_type == 'true_false':
            return str(answer) == str(question.correct_answer)
        elif question.question_type == 'multi':
            correct_choices = question.choices.filter(is_correct=True).values_list('id', flat=True)
            return set(answer) == set(correct_choices)
        else:  # identification
            return answer.lower().strip() == question.correct_answer.lower().strip()