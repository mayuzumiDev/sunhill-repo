from django.core.management.base import BaseCommand
from special_education.models import AssessmentCategory, Question

class Command(BaseCommand):
    help = 'Creates test data for special education assessments'

    def handle(self, *args, **kwargs):
        # Create ADHD Assessment Category
        adhd_category = AssessmentCategory.objects.create(
            title='ADHD Assessment',
            description='Attention Deficit Hyperactivity Disorder evaluation'
        )

        # Create ADHD questions
        adhd_questions = [
            {
                'text': 'Does the student have difficulty maintaining attention during tasks or play?',
                'category': 'Attention'
            },
            {
                'text': 'Is the student easily distracted by external stimuli?',
                'category': 'Attention'
            },
            {
                'text': 'Does the student avoid tasks that require sustained mental effort?',
                'category': 'Attention'
            },
            {
                'text': 'Does the student seem to not listen when spoken to directly?',
                'category': 'Attention'
            }
        ]

        for q in adhd_questions:
            Question.objects.create(
                category=adhd_category,
                question_text=q['text'],
                question_category=q['category']
            )

        # Create ASD Assessment Category
        asd_category = AssessmentCategory.objects.create(
            title='ASD Assessment',
            description='Autism Spectrum Disorder evaluation'
        )

        # Create ASD questions
        asd_questions = [
            {
                'text': 'Does the student have difficulty with social interaction or communication?',
                'category': 'Social Communication'
            },
            {
                'text': 'Does the student struggle to maintain eye contact during conversations?',
                'category': 'Social Communication'
            },
            {
                'text': 'Does the student show repetitive behaviors or restricted interests?',
                'category': 'Behavior Patterns'
            },
            {
                'text': 'Does the student have difficulty understanding facial expressions or body language?',
                'category': 'Social Communication'
            }
        ]

        for q in asd_questions:
            Question.objects.create(
                category=asd_category,
                question_text=q['text'],
                question_category=q['category']
            )

        # Create Intellectual Assessment Category
        intellectual_category = AssessmentCategory.objects.create(
            title='Intellectual Assessment',
            description='Evaluation of intellectual functioning and adaptive behavior'
        )

        # Create Intellectual Assessment questions
        intellectual_questions = [
            {
                'text': 'Does the student show significant delays in academic learning?',
                'category': 'Academic Performance'
            },
            {
                'text': 'Does the student have difficulty understanding basic concepts?',
                'category': 'Academic Performance'
            },
            {
                'text': 'Does the student have difficulty with daily living skills?',
                'category': 'Adaptive Functioning'
            },
            {
                'text': 'Can the student follow safety rules and understand dangers?',
                'category': 'Adaptive Functioning'
            }
        ]

        for q in intellectual_questions:
            Question.objects.create(
                category=intellectual_category,
                question_text=q['text'],
                question_category=q['category']
            )

        self.stdout.write(self.style.SUCCESS('Successfully created test data'))
