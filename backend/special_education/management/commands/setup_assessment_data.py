from django.core.management.base import BaseCommand
from special_education.models import AssessmentCategory, Question

class Command(BaseCommand):
    help = 'Set up sample assessment data'

    def handle(self, *args, **options):
        # Create categories
        categories = [
            {
                'title': 'Attention and Focus',
                'description': 'Assessment of attention span, focus, and concentration abilities'
            },
            {
                'title': 'Social Communication',
                'description': 'Assessment of social interaction and communication skills'
            },
            {
                'title': 'Learning Skills',
                'description': 'Assessment of academic and cognitive learning abilities'
            }
        ]
        
        for cat_data in categories:
            category, created = AssessmentCategory.objects.get_or_create(
                title=cat_data['title'],
                defaults={
                    'description': cat_data['description'],
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(f"Created category: {category.title}")
            
            # Create 15 questions for each category (more than needed to ensure we have enough)
            questions = [
                {
                    'Attention and Focus': [
                        "Has difficulty maintaining focus during tasks",
                        "Gets easily distracted by external stimuli",
                        "Struggles to follow multi-step instructions",
                        "Has trouble organizing tasks and activities",
                        "Often loses things necessary for tasks",
                        "Appears to not listen when spoken to directly",
                        "Avoids tasks requiring sustained mental effort",
                        "Makes careless mistakes in schoolwork",
                        "Has difficulty staying seated when required",
                        "Fidgets with hands or feet frequently",
                        "Struggles to wait their turn",
                        "Interrupts or intrudes on others",
                        "Rushes through work without checking",
                        "Has trouble remembering daily activities",
                        "Needs frequent reminders to stay on task"
                    ],
                    'Social Communication': [
                        "Has difficulty making eye contact",
                        "Struggles to maintain conversations",
                        "Has trouble understanding social cues",
                        "Shows limited facial expressions",
                        "Struggles with turn-taking in conversation",
                        "Has difficulty making friends",
                        "Prefers to play or work alone",
                        "Has trouble expressing emotions appropriately",
                        "Struggles with personal space awareness",
                        "Has difficulty understanding jokes or sarcasm",
                        "Shows limited interest in peer relationships",
                        "Has trouble adapting to social situations",
                        "Struggles with group activities",
                        "Has difficulty sharing interests with others",
                        "Shows limited empathy towards others"
                    ],
                    'Learning Skills': [
                        "Has difficulty with reading comprehension",
                        "Struggles with basic math concepts",
                        "Has trouble with written expression",
                        "Shows inconsistent academic performance",
                        "Has difficulty following classroom routines",
                        "Struggles with time management",
                        "Has trouble with abstract concepts",
                        "Shows difficulty in problem-solving",
                        "Has trouble remembering learned material",
                        "Struggles with sequential tasks",
                        "Has difficulty with phonological awareness",
                        "Shows inconsistent work completion",
                        "Has trouble with independent work",
                        "Struggles with new concept acquisition",
                        "Has difficulty with study skills"
                    ]
                }
            ][0]
            
            category_questions = questions.get(category.title, [])
            for q_text in category_questions:
                question, created = Question.objects.get_or_create(
                    question_text=q_text,
                    defaults={
                        'category': category,
                        'question_category': category.title.split()[0],
                        'is_active': True
                    }
                )
                if created:
                    self.stdout.write(f"Created question for {category.title}: {q_text[:50]}...")
