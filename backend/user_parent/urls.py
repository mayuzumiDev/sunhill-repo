from django.urls import path
from .views.account.parent_account_views import *
from .views.profile.parent_profile_views import *
from .views.student.parent_student_list_view import *
from .views.quizzes.student_scores_views import *
from .views.analytics.analytics import *
from .views.metrics.metrics_views import *

urlpatterns = [
    # Parent Account Management
    path('current-parent/', CurrentParentView.as_view(), name='current-parent'),
    path('profile/', CurrentParentView.as_view(), name='parent-profile'),  
    path('custom-user/edit/<str:id>/', ParentCustomUserEditView.as_view(), name='edit-parent-user'),
    path('user-info/edit/<str:user_info_id>/', ParentUserInfoEditView.as_view(), name='edit-parent-info'),
    
    # Profile Image Management
    path('user-info/profile-image/', ParentProfileImageView.as_view(), name='parent-profile-image'),

    path('students/list/', ParentStudentListView.as_view(), name='parent-student-list'),
    path('students/scores/', ParentStudentScoresView.as_view(), name='parent_student_scores'),

    path('analytics/student-progress/', parent_student_progress, name='parent-student-progress'),
    path('analytics/peer-benchmarking/', peer_benchmarking, name='peer-benchmarking'),

    path('metrics/', MetricsView.as_view(), name='metrics-view'),
]
