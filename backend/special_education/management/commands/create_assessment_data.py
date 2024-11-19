from django.core.management.base import BaseCommand
from special_education.models import AssessmentCategory, Question

class Command(BaseCommand):
    help = 'Creates comprehensive assessment categories and questions for special education'

    def handle(self, *args, **kwargs):
        # Clear existing data
        AssessmentCategory.objects.all().delete()
        Question.objects.all().delete()

        # 1. ADHD Assessment
        adhd = AssessmentCategory.objects.create(
            title='ADHD Assessment',
            description='Comprehensive assessment for Attention Deficit Hyperactivity Disorder'
        )
        
        adhd_questions = [
            ('Attention', [
                'Has difficulty sustaining attention in tasks or play activities',
                'Does not seem to listen when spoken to directly',
                'Has trouble organizing tasks and activities',
                'Avoids tasks that require sustained mental effort',
                'Is easily distracted by external stimuli',
            ]),
            ('Hyperactivity', [
                'Fidgets with hands/feet or squirms in seat',
                'Leaves seat in situations when remaining seated is expected',
                'Runs about or climbs in situations where it is inappropriate',
                'Has difficulty playing or engaging in leisure activities quietly',
                'Acts as if "driven by a motor"',
            ]),
            ('Impulsivity', [
                'Blurts out answers before questions have been completed',
                'Has difficulty waiting their turn',
                'Interrupts or intrudes on others',
                'Makes decisions without considering consequences',
                'Rushes through assignments with careless mistakes',
            ])
        ]

        # 2. Autism Spectrum Disorder (ASD) Assessment
        asd = AssessmentCategory.objects.create(
            title='Autism Spectrum Disorder Assessment',
            description='Comprehensive evaluation for Autism Spectrum Disorder characteristics'
        )

        asd_questions = [
            ('Social Communication', [
                'Has difficulty maintaining eye contact',
                'Struggles to understand facial expressions and body language',
                'Has trouble maintaining back-and-forth conversation',
                'Shows limited interest in peer relationships',
                'Uses limited or no gestures to communicate',
            ]),
            ('Behavior Patterns', [
                'Shows repetitive motor movements or speech',
                'Insists on sameness and routines',
                'Has highly restricted, fixated interests',
                'Shows unusual responses to sensory input',
                'Demonstrates rigid thinking patterns',
            ]),
            ('Social Understanding', [
                'Has difficulty understanding social cues',
                'Struggles with perspective-taking',
                'Shows limited emotional reciprocity',
                'Has trouble adapting behavior to different social contexts',
                'Demonstrates limited understanding of personal space',
            ])
        ]

        # 3. Learning Disabilities Assessment
        learning = AssessmentCategory.objects.create(
            title='Learning Disabilities Assessment',
            description='Evaluation of specific learning disabilities and academic challenges'
        )

        learning_questions = [
            ('Academic Performance', [
                'Has difficulty with reading comprehension',
                'Struggles with mathematical calculations',
                'Shows problems with written expression',
                'Has trouble with spelling',
                'Demonstrates poor handwriting',
            ]),
            ('Cognitive Skills', [
                'Has difficulty following multi-step instructions',
                'Shows problems with short-term memory',
                'Struggles with time management',
                'Has trouble with abstract concepts',
                'Demonstrates difficulty with problem-solving',
            ]),
            ('Language Development', [
                'Has trouble expressing thoughts verbally',
                'Shows difficulty understanding spoken instructions',
                'Struggles with vocabulary development',
                'Has problems with phonological awareness',
                'Shows difficulty with reading fluency',
            ])
        ]

        # 4. Emotional/Behavioral Assessment
        emotional = AssessmentCategory.objects.create(
            title='Emotional/Behavioral Assessment',
            description='Evaluation of emotional regulation and behavioral challenges'
        )

        emotional_questions = [
            ('Emotional Understanding', [
                'Has difficulty identifying emotions in self and others',
                'Shows problems with emotional regulation',
                'Demonstrates unexpected emotional responses',
                'Has trouble coping with changes',
                'Shows signs of anxiety or depression',
            ]),
            ('Behavior Patterns', [
                'Demonstrates aggressive or disruptive behavior',
                'Shows difficulty following rules',
                'Has problems with impulse control',
                'Demonstrates withdrawal from social situations',
                'Shows unusual or concerning behaviors',
            ]),
            ('Social Skills', [
                'Has trouble making and keeping friends',
                'Shows difficulty with conflict resolution',
                'Demonstrates problems with empathy',
                'Has trouble working in groups',
                'Shows inappropriate social behaviors',
            ])
        ]

        # 5. Speech and Language Assessment
        speech = AssessmentCategory.objects.create(
            title='Speech and Language Assessment',
            description='Evaluation of speech, language, and communication skills'
        )

        speech_questions = [
            ('Language Development', [
                'Has difficulty expressing ideas clearly',
                'Shows limited vocabulary for age',
                'Struggles with grammar and sentence structure',
                'Has trouble understanding complex language',
                'Shows problems with narrative skills',
            ]),
            ('Speech Production', [
                'Has difficulty pronouncing certain sounds',
                'Shows problems with speech fluency',
                'Demonstrates unclear speech',
                'Has trouble with voice quality or volume',
                'Shows difficulty with speech rhythm',
            ]),
            ('Social Communication', [
                'Has trouble with conversational turn-taking',
                'Shows difficulty using language in social situations',
                'Demonstrates problems with nonverbal communication',
                'Has trouble understanding jokes or idioms',
                'Shows difficulty with pragmatic language skills',
            ])
        ]

        # Create all questions
        all_categories = {
            adhd: adhd_questions,
            asd: asd_questions,
            learning: learning_questions,
            emotional: emotional_questions,
            speech: speech_questions
        }

        for category, question_groups in all_categories.items():
            for question_category, questions in question_groups:
                for question_text in questions:
                    Question.objects.create(
                        category=category,
                        question_text=question_text,
                        question_category=question_category
                    )

        self.stdout.write(self.style.SUCCESS('Successfully created all assessment categories and questions'))
