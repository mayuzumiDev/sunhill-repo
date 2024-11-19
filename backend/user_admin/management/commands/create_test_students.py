from django.core.management.base import BaseCommand
from api.models import CustomUser
from user_admin.models.account_models import UserInfo, StudentInfo
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Creates test students for development'

    def handle(self, *args, **kwargs):
        # Clear existing test students
        CustomUser.objects.filter(role='student').delete()

        test_students = [
            {
                'first_name': 'John',
                'last_name': 'Smith',
                'grade': 'Grade 1',
                'username': 'student-john-001',
            },
            {
                'first_name': 'Emma',
                'last_name': 'Johnson',
                'grade': 'Grade 2',
                'username': 'student-emma-002',
            },
            {
                'first_name': 'Michael',
                'last_name': 'Davis',
                'grade': 'Grade 3',
                'username': 'student-michael-003',
            },
            {
                'first_name': 'Sophia',
                'last_name': 'Wilson',
                'grade': 'Grade 4',
                'username': 'student-sophia-004',
            },
            {
                'first_name': 'Oliver',
                'last_name': 'Brown',
                'grade': 'Grade 5',
                'username': 'student-oliver-005',
            }
        ]

        for student_data in test_students:
            # Create CustomUser
            user = CustomUser.objects.create(
                username=student_data['username'],
                first_name=student_data['first_name'],
                last_name=student_data['last_name'],
                email=f"{student_data['username']}@example.com",
                password=make_password('Test@123'),
                role='student',
                branch_name='Main Branch'
            )

            # Create UserInfo
            user_info = UserInfo.objects.create(
                user=user,
                contact_no='1234567890'
            )

            # Create StudentInfo
            StudentInfo.objects.create(
                student_info=user_info,
                grade_level=student_data['grade']
            )

        self.stdout.write(self.style.SUCCESS('Successfully created test students'))
