from django.db import models
from .classroom_models import Classroom
from user_admin.models.account_models import TeacherInfo, StudentInfo

class Quiz(models.Model):
    TYPE_CHOICES = [
        ('quiz', 'Quiz'),
        ('activity', 'Activity'),
    ]
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(TeacherInfo, on_delete=models.CASCADE, related_name='quizzes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(blank=True, null=True) 
    type_of = models.CharField(max_length=20, choices=TYPE_CHOICES, default='quiz')


class Question(models.Model):
    QUESTION_TYPES = [
        ('single', 'Single Choice'),
        ('multi', 'Multiple Choice'),
        ('identification', 'Identification'),
        ('true_false', 'True or False')
    ]
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    image = models.ImageField(upload_to='quiz_questions/', blank=True, null=True)
    question_type = models.CharField(max_length=50, choices=QUESTION_TYPES)
    correct_answer = models.CharField(max_length=255, blank=True, null=True)


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)


class StudentResponse(models.Model):
    student = models.ForeignKey(StudentInfo, on_delete=models.CASCADE, related_name='responses')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='responses')
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='responses')
    responses = models.JSONField()  # Store answers
    submitted_at = models.DateTimeField(auto_now_add=True)


class QuizScore(models.Model):
    student = models.ForeignKey(StudentInfo, on_delete=models.CASCADE, related_name='quiz_scores')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='student_scores')
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='quiz_scores')
    student_response = models.OneToOneField(StudentResponse, on_delete=models.CASCADE, related_name='score')

    STATUS_CHOICES = [
        ('passed', 'Passed'),
        ('failed', 'Failed'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    total_score = models.IntegerField()  # Number of correct answers
    total_possible = models.IntegerField()  # Total number of questions
    percentage_score = models.DecimalField(max_digits=5, decimal_places=2)  # Score in percentage

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    