from django.db import models
from user_admin.models.account_models import StudentInfo
from django.contrib.auth import get_user_model

User = get_user_model()

class AssessmentCategory(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Assessment Categories"

    def __str__(self):
        return self.title

class Question(models.Model):
    CATEGORY_CHOICES = [
        ('Attention', 'Attention'),
        ('Hyperactivity', 'Hyperactivity'),
        ('Impulsivity', 'Impulsivity'),
        ('Social Communication', 'Social Communication'),
        ('Behavior Patterns', 'Behavior Patterns'),
        ('Social Understanding', 'Social Understanding'),
        ('Emotional Understanding', 'Emotional Understanding'),
        ('Academic Performance', 'Academic Performance'),
        ('Cognitive Skills', 'Cognitive Skills'),
        ('Language Development', 'Language Development'),
        ('Speech Production', 'Speech Production'),
        ('Social Skills', 'Social Skills'),
    ]

    category = models.ForeignKey(AssessmentCategory, on_delete=models.CASCADE)
    question_text = models.TextField()
    question_category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.category.title} - {self.question_category}: {self.question_text[:50]}..."

class StudentAssessment(models.Model):
    student = models.ForeignKey(StudentInfo, on_delete=models.CASCADE)
    category = models.ForeignKey(AssessmentCategory, on_delete=models.CASCADE)
    assessor = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        # No unique constraint - we'll handle this in the view

    def __str__(self):
        return f"{self.student.student_info.user.first_name} - {self.category.title} ({self.date})"

class AssessmentResponse(models.Model):
    RESPONSE_CHOICES = [
        ('never', 'Never'),
        ('sometimes', 'Sometimes'),
        ('often', 'Often'),
        ('very_often', 'Very Often'),
    ]

    assessment = models.ForeignKey(StudentAssessment, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    response = models.CharField(max_length=20, choices=RESPONSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['assessment', 'question']

    def __str__(self):
        return f"{self.assessment} - {self.question.question_text[:30]}..."
