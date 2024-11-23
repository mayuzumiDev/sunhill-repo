from django.core.management.base import BaseCommand
from special_education.models import AssessmentCategory, Question

class Command(BaseCommand):
    help = 'Check and display assessment data statistics'

    def handle(self, *args, **options):
        # Check categories
        total_categories = AssessmentCategory.objects.count()
        active_categories = AssessmentCategory.objects.filter(is_active=True).count()
        
        self.stdout.write(f"Total categories: {total_categories}")
        self.stdout.write(f"Active categories: {active_categories}")
        
        # Check questions
        total_questions = Question.objects.count()
        active_questions = Question.objects.filter(is_active=True).count()
        
        self.stdout.write(f"\nTotal questions: {total_questions}")
        self.stdout.write(f"Active questions: {active_questions}")
        
        # Check questions per category
        categories = AssessmentCategory.objects.filter(is_active=True)
        self.stdout.write("\nQuestions per active category:")
        for category in categories:
            question_count = Question.objects.filter(
                category=category,
                is_active=True
            ).count()
            self.stdout.write(f"- {category.title}: {question_count} active questions")
