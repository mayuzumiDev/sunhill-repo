from django.core.management.base import BaseCommand
from special_education.models import Question, AssessmentCategory

class Command(BaseCommand):
    help = 'Add Tagalog translations for assessment questions'

    def handle(self, *args, **options):
        # Dictionary of English to Tagalog translations for questions
        translations = {
            # ADHD Assessment - Attention
            'Has difficulty sustaining attention in tasks or play activities': 'Nahihirapang mapanatili ang atensyon sa mga gawain o aktibidad',
            'Does not seem to listen when spoken to directly': 'Tila hindi nakikinig kapag kinakausap ng direkta',
            'Has trouble organizing tasks and activities': 'Nahihirapang mag-organisa ng mga gawain at aktibidad',
            'Avoids tasks that require sustained mental effort': 'Umiiwas sa mga gawaing nangangailangan ng matagalang pagsisikap ng isip',
            'Is easily distracted by external stimuli': 'Madaling naaabala ng mga panlabas na bagay',
            'Frequently loses things necessary for tasks': 'Madalas nawawawala ang mga bagay na kailangan sa mga gawain',
            'Has difficulty following instructions': 'Nahihirapang sumunod sa mga tagubilin',
            'Makes careless mistakes': 'Gumagawa ng mga pagkakamaling walang ingat',
            'Has trouble staying focused': 'Nahihirapang manatiling nakatuon',
            'Forgets daily activities': 'Nakakalimutan ang mga pang-araw-araw na gawain',

            # ADHD Assessment - Hyperactivity
            'Fidgets with hands/feet or squirms in seat': 'Palaging gumagalaw ng kamay/paa o hindi mapakali sa upuan',
            'Leaves seat in situations when remaining seated is expected': 'Umaalis sa upuan sa mga sitwasyong dapat nakaupo',
            'Runs about or climbs in situations where it is inappropriate': 'Tumatakbo o umaakyat sa mga sitwasyong hindi naaangkop',
            'Has difficulty playing or engaging in leisure activities quietly': 'Nahihirapang maglaro o makibahagi sa mga aktibidad nang tahimik',
            'Acts as if "driven by a motor"': 'Kumikilos na parang may motor',
            'Talks excessively': 'Labis na madaldal',
            'Always "on the go"': 'Palaging aktibo',
            'Cannot sit still': 'Hindi makapag-upo nang tahimik',
            'Shows excessive physical movement': 'Nagpapakita ng labis na pisikal na paggalaw',
            'Has high energy levels': 'May mataas na antas ng enerhiya',

            # ADHD Assessment - Impulsivity
            'Blurts out answers before questions have been completed': 'Biglang sumasagot bago pa matapos ang tanong',
            'Has difficulty waiting their turn': 'Nahihirapang maghintay ng kanilang pagkakataon',
            'Interrupts or intrudes on others': 'Sumisingit o nanggugulo sa iba',
            'Makes decisions without considering consequences': 'Gumagawa ng desisyon nang hindi iniisip ang mga kahihinatnan',
            'Rushes through assignments with careless mistakes': 'Nagmamadali sa mga takdang-aralin na may mga pagkakamaling walang ingat',
            'Acts without thinking': 'Kumikilos nang hindi nag-iisip',
            'Has trouble controlling impulses': 'Nahihirapang kontrolin ang mga udyok',
            'Speaks out of turn': 'Nagsasalita nang hindi pa tiempo',
            'Cannot wait patiently': 'Hindi makapaghintay nang matiyaga',
            'Takes risks without consideration': 'Sumusuong sa panganib nang walang pag-iisip',

            # ASD Assessment - Social Communication
            'Has difficulty maintaining eye contact': 'Nahihirapang mapanatili ang eye contact',
            'Struggles to understand facial expressions and body language': 'Nahihirapang umunawa ng mga ekspresyon ng mukha at body language',
            'Difficulty engaging in back-and-forth conversation': 'Nahihirapang makipag-usap nang may palitan',
            'Uses limited or no gestures to communicate': 'Limitado o walang paggamit ng galaw para makipag-usap',
            'Struggles with social relationships': 'Nahihirapang makipag-ugnayan sa ibang tao',
            'Has trouble understanding social cues': 'Nahihirapang maintindihan ang mga social cues',
            'Shows limited interest in peer relationships': 'Nagpapakita ng limitadong interes sa pakikipag-kaibigan',
            'Has difficulty expressing emotions': 'Nahihirapang magpahayag ng damdamin',
            'Struggles with nonverbal communication': 'Nahihirapang makipag-usap sa pamamagitan ng galaw',
            'Has trouble maintaining friendships': 'Nahihirapang magpanatili ng pakikipagkaibigan',

            # ASD Assessment - Behavior Patterns
            'Insists on following specific routines': 'Matigas sa pagsunod sa mga partikular na gawain',
            'Shows unusual sensory interests or behaviors': 'Nagpapakita ng hindi pangkaraniwang interes o gawi sa pandama',
            'Has restricted or intense interests': 'May limitado o matinding interes sa mga bagay',
            'Displays repetitive movements or speech': 'Nagpapakita ng paulit-ulit na kilos o pananalita',
            'Becomes upset with small changes': 'Nababalisa sa maliliit na pagbabago',
            'Shows rigid thinking patterns': 'Nagpapakita ng hindi flexible na pag-iisip',
            'Has specific routines or rituals': 'May mga partikular na gawain o ritwal',
            'Fixates on particular objects': 'Nakatutok sa mga partikular na bagay',
            'Shows unusual responses to sensory input': 'Nagpapakita ng kakaibang reaksyon sa mga pandama',
            'Has difficulty with changes in routine': 'Nahihirapang tanggapin ang mga pagbabago sa gawain',

            # Learning Assessment - Academic Performance
            'Struggles with reading comprehension': 'Nahihirapang umunawa ng binabasa',
            'Has difficulty with basic math calculations': 'Nahihirapang magsagawa ng simpleng matematika',
            'Poor writing skills compared to peers': 'Mahina ang kasanayan sa pagsulat kumpara sa mga kaedad',
            'Difficulty following written instructions': 'Nahihirapang sumunod sa nakasulat na tagubilin',
            'Struggles with spelling': 'Nahihirapang mag-spell ng mga salita',
            'Has trouble with reading fluency': 'Nahihirapang bumasa nang maayos',
            'Shows difficulty in math problem solving': 'Nahihirapang lutasin ang mga mathematical problems',
            'Has poor handwriting': 'May mahinang handwriting',
            'Struggles with written expression': 'Nahihirapang magpahayag sa pamamagitan ng pagsulat',
            'Has trouble understanding academic concepts': 'Nahihirapang maintindihan ang mga academic concepts',

            # Language Development
            'Limited vocabulary for age': 'Limitadong bokabularyo para sa edad',
            'Difficulty expressing thoughts clearly': 'Nahihirapang magpahayag ng malinaw na kaisipan',
            'Problems understanding complex sentences': 'May problema sa pag-unawa ng masalimuot na pangungusap',
            'Struggles with grammar and sentence structure': 'Nahihirapang bumuo ng wastong pangungusap',
            'Limited use of language in social situations': 'Limitadong paggamit ng wika sa mga sosyal na sitwasyon',
            'Has trouble following verbal instructions': 'Nahihirapang sumunod sa verbal na tagubilin',
            'Shows difficulty in word finding': 'Nahihirapang makahanap ng tamang salita',
            'Has problems with pronunciation': 'May problema sa pagbigkas ng mga salita',
            'Struggles with language comprehension': 'Nahihirapang umunawa ng wika',
            'Shows limited verbal expression': 'Nagpapakita ng limitadong verbal na pagpapahayag',

            # Social Skills
            'Difficulty making friends': 'Nahihirapang makipagkaibigan',
            'Problems sharing and taking turns': 'May problema sa pagbabahagi at paghihintay ng pagkakataon',
            'Limited understanding of social rules': 'Limitadong pag-unawa sa mga panuntunang panlipunan',
            'Struggles with group activities': 'Nahihirapang makisali sa mga grupong gawain',
            'Difficulty understanding others\' feelings': 'Nahihirapang umunawa ng damdamin ng iba',
            'Has trouble with social interactions': 'Nahihirapang makipag-ugnayan sa iba',
            'Shows difficulty in cooperative play': 'Nahihirapang makipaglaro nang may kooperasyon',
            'Has problems with conflict resolution': 'May problema sa paglutas ng hindi pagkakaunawaan',
            'Struggles with social boundaries': 'Nahihirapang maintindihan ang social boundaries',
            'Shows limited empathy': 'Nagpapakita ng limitadong empathy'
        }

        # Update each question with its Tagalog translation
        updated_count = 0
        for eng_text, tl_text in translations.items():
            questions = Question.objects.filter(question_text=eng_text)
            for question in questions:
                question.question_text_tl = tl_text
                question.save()
                self.stdout.write(f"Updated question: {question.question_text[:50]}...")
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully updated {updated_count} questions with Tagalog translations'
            )
        )
