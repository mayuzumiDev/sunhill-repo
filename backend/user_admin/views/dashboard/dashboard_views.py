from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.db.models.functions import ExtractMonth, TruncDate
from user_admin.models.account_models import CustomUser, StudentInfo, TeacherInfo, ParentInfo
from user_teacher.models.classroom_models import Classroom, ClassRoomStudent
from datetime import datetime, timedelta
from django.utils import timezone

class DashboardMetricsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get counts for different user types
        student_count = StudentInfo.objects.count()
        teacher_count = TeacherInfo.objects.count()
        parent_count = ParentInfo.objects.count()
        public_user_count = CustomUser.objects.filter(role='public').count()
        
        # Get total class count
        total_class_count = Classroom.objects.count()

        # Get active vs inactive users
        total_users = CustomUser.objects.count()
        active_users = CustomUser.objects.filter(is_active=True).count()
        inactive_users = total_users - active_users

        # Get user type percentages
        total_users_with_roles = student_count + teacher_count + parent_count + public_user_count
        user_percentages = {
            'students': round((student_count / total_users_with_roles) * 100, 1) if total_users_with_roles > 0 else 0,
            'teachers': round((teacher_count / total_users_with_roles) * 100, 1) if total_users_with_roles > 0 else 0,
            'parents': round((parent_count / total_users_with_roles) * 100, 1) if total_users_with_roles > 0 else 0,
            'public': round((public_user_count / total_users_with_roles) * 100, 1) if total_users_with_roles > 0 else 0,
        }

        # Get monthly registration data for the current year
        current_year = timezone.now().year
        monthly_registrations = (
            CustomUser.objects
            .filter(date_joined__year=current_year)
            .annotate(month=ExtractMonth('date_joined'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        # Get last 7 days registration trend
        last_week = timezone.now() - timedelta(days=7)
        weekly_registrations = (
            CustomUser.objects
            .filter(date_joined__gte=last_week)
            .annotate(date=TruncDate('date_joined'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        # Get average class size
        total_students_in_classes = ClassRoomStudent.objects.count()
        avg_class_size = round(total_students_in_classes / total_class_count, 1) if total_class_count > 0 else 0

        # Convert month numbers to month names
        month_names = {
            1: 'January', 2: 'February', 3: 'March', 4: 'April',
            5: 'May', 6: 'June', 7: 'July', 8: 'August',
            9: 'September', 10: 'October', 11: 'November', 12: 'December'
        }

        monthly_data = [
            {'month': month_names[item['month']], 'count': item['count']}
            for item in monthly_registrations
        ]

        weekly_data = [
            {
                'date': item['date'].strftime('%Y-%m-%d'),
                'count': item['count']
            }
            for item in weekly_registrations
        ]

        return Response({
            'student_count': student_count,
            'teacher_count': teacher_count,
            'parent_count': parent_count,
            'public_user_count': public_user_count,
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': inactive_users,
            'class_count': total_class_count,
            'average_class_size': avg_class_size,
            'user_percentages': user_percentages,
            'monthly_registrations': monthly_data,
            'weekly_registrations': weekly_data
        })

class BranchMetricsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, branch_id):
        try:
            # Add print statement for debugging
            print(f"Fetching metrics for branch_id: {branch_id}")
            
            # Get class count for the specific branch
            class_count = Classroom.objects.filter(branch_id=branch_id).count()
            print(f"Found {class_count} classes")
            
            # Get students in classes for this branch
            total_students_in_classes = ClassRoomStudent.objects.filter(
                classroom__branch_id=branch_id
            ).count()
            
            # Calculate average class size
            avg_class_size = round(total_students_in_classes / class_count, 1) if class_count > 0 else 0

            data = {
                'class_count': class_count,
                'average_class_size': avg_class_size
            }
            print(f"Returning data: {data}")
            return Response(data)
            
        except Exception as e:
            print(f"Error in BranchMetricsView: {str(e)}")
            return Response({
                'error': str(e)
            }, status=500)
    