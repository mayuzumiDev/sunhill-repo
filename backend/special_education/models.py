from django.db import models
from user_admin.models.account_models import StudentInfo
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta
from django.utils import timezone

User = get_user_model()

class AssessmentCategory(models.Model):
    title = models.CharField(max_length=100)
    title_tl = models.CharField(max_length=100, verbose_name="Title (Tagalog)", blank=True)
    description = models.TextField()
    description_tl = models.TextField(verbose_name="Description (Tagalog)", blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Assessment Categories"

    def __str__(self):
        return self.title

    def get_title(self, language='en'):
        return self.title_tl if language == 'tl' and self.title_tl else self.title

    def get_description(self, language='en'):
        return self.description_tl if language == 'tl' and self.description_tl else self.description

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

    CATEGORY_TRANSLATIONS = {
        'Attention': 'Atensyon',
        'Hyperactivity': 'Sobrang Aktibo',
        'Impulsivity': 'Pagkamapusok',
        'Social Communication': 'Pakikipag-ugnayan sa Kapwa',
        'Behavior Patterns': 'Mga Gawi sa Pag-uugali',
        'Social Understanding': 'Pag-unawa sa Lipunan',
        'Emotional Understanding': 'Pag-unawa sa Damdamin',
        'Academic Performance': 'Pagganap sa Akademiko',
        'Cognitive Skills': 'Kakayahang Pang-isip',
        'Language Development': 'Pag-unlad ng Wika',
        'Speech Production': 'Paggawa ng Pananalita',
        'Social Skills': 'Kakayahang Panlipunan'
    }

    question_text = models.TextField()
    question_text_tl = models.TextField(verbose_name="Question Text (Tagalog)", blank=True)
    category = models.ForeignKey(AssessmentCategory, on_delete=models.CASCADE)
    question_category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.category.title} - {self.question_category}: {self.question_text[:50]}..."

    def get_question_text(self, language='en'):
        return self.question_text_tl if language == 'tl' and self.question_text_tl else self.question_text

    def get_category_translation(self, language='en'):
        if language == 'tl':
            return self.CATEGORY_TRANSLATIONS.get(self.question_category, self.question_category)
        return self.question_category

class StudentAssessment(models.Model):
    student = models.ForeignKey(StudentInfo, on_delete=models.CASCADE)
    category = models.ForeignKey(AssessmentCategory, on_delete=models.CASCADE)
    assessor = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)
    completed = models.BooleanField(default=False)
    results_available_date = models.DateTimeField(null=True, blank=True)
    assessment_number = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"Assessment for {self.student} - {self.category}"

    def save(self, *args, **kwargs):
        if not self.pk:  # Only for new assessments
            # Get the count of completed assessments for this student
            completed_count = StudentAssessment.objects.filter(
                student=self.student,
                completed=True
            ).count()
            
            # Set the assessment number
            self.assessment_number = completed_count + 1
            
            # Set results_available_date if not set
            if not self.results_available_date:
                self.results_available_date = timezone.now() + timedelta(days=30)

        super().save(*args, **kwargs)

    @property
    def are_results_available(self):
        return timezone.now() >= self.results_available_date if self.results_available_date else False

    def calculate_category_scores(self):
        if not self.completed:
            return None

        responses = AssessmentResponse.objects.filter(assessment=self)
        if not responses:
            return None

        # Define score mapping
        score_mapping = {
            'never': 0,
            'sometimes': 1,
            'often': 2,
            'very_often': 3
        }

        # Initialize category scores
        category_scores = {}
        category_counts = {}

        # Calculate scores for each category
        for response in responses:
            category = response.question.question_category
            score = score_mapping.get(response.response, 0)
            
            if category not in category_scores:
                category_scores[category] = 0
                category_counts[category] = 0
            
            category_scores[category] += score
            category_counts[category] += 1

        # Calculate percentages
        results = {}
        for category in category_scores:
            max_possible = category_counts[category] * 3  # 3 is max score per question
            if max_possible > 0:
                percentage = (category_scores[category] / max_possible) * 100
                results[category] = round(percentage, 1)

        return results

    @classmethod
    def get_completion_analysis(cls, student_id):
        """Calculate completion analysis for a student's 30 assessments"""
        assessments = cls.objects.filter(
            student_id=student_id,
            completed=True
        ).order_by('-date')[:30]

        if not assessments:
            return None

        total_assessments = len(assessments)
        completion_percentage = (total_assessments / 30) * 100

        # Initialize category tracking
        category_totals = {}
        category_counts = {}
        assessment_timeline = []

        # Process each assessment
        for assessment in assessments:
            scores = assessment.calculate_category_scores()
            if scores:
                # Add to timeline
                assessment_timeline.append({
                    'date': assessment.date,
                    'scores': scores
                })

                # Update category totals
                for category, score in scores.items():
                    if category not in category_totals:
                        category_totals[category] = 0
                        category_counts[category] = 0
                    category_totals[category] += score
                    category_counts[category] += 1

        # Calculate average scores per category
        category_percentages = {}
        dominant_category = None
        highest_score = 0

        for category in category_totals:
            if category_counts[category] > 0:
                average = category_totals[category] / category_counts[category]
                category_percentages[category] = round(average, 1)
                
                # Track highest scoring category
                if average > highest_score:
                    highest_score = average
                    dominant_category = category

        return {
            'total_assessments': total_assessments,
            'completion_percentage': completion_percentage,
            'category_percentages': category_percentages,
            'dominant_category': dominant_category,
            'assessment_timeline': assessment_timeline,
            'latest_assessment': assessments[0] if assessments else None
        }

class AssessmentResponse(models.Model):
    RESPONSE_CHOICES = [
        ('never', 'Never'),
        ('sometimes', 'Sometimes'),
        ('often', 'Often'),
        ('very_often', 'Very Often'),
    ]

    assessment = models.ForeignKey(
        StudentAssessment,
        on_delete=models.CASCADE,
        related_name='responses'
    )
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    response = models.CharField(max_length=20, choices=RESPONSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['assessment', 'question']

    def __str__(self):
        return f"{self.assessment} - {self.question}: {self.response}"
