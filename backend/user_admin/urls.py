from django.urls import path, include
from rest_framework import routers
from rest_framework.routers import DefaultRouter
from .views.current_admin_views import *
from .views.account.account_views_create import *
from .views.account.account_views_list import *
from .views.account.account_views_edit import *
from .views.account.pdf_accounts import *
from .views.branches.user_count_views import *
from .views.profile.admin_profile_views import *
from .views.events.event_manage_views import *
from .views.events.event_list_views import *
from .views.notifications.notification_views import EventNotificationViewSet
from .views.dashboard.dashboard_views import DashboardMetricsView, BranchMetricsView

router = DefaultRouter()
router.register(r'notifications', EventNotificationViewSet, basename='notifications')

urlpatterns = [
    path('current-admin/', CurrentAdminView.as_view(), name="current_admin" ),
    
    path('generate-account/', GenerateAccountView.as_view(), name="generate_account" ),
    path("create-account/", CreateAccountView.as_view(), name='create_account'),
    path("custom-user/delete/", CustomUserDeleteView.as_view(), name="custom_user_delete"),
    path("custom-user/edit/<int:pk>/", CustomUserEditView.as_view(), name='custom_user_edit'),
    path("user-info/edit/<int:pk>/", UserInfoEditView.as_view(), name='user_info_edit'),
    path('user-info/profile-image/', AdminProfileImageView.as_view(), name='admin_profile_image'),
    path("student-info/edit/<int:pk>/", StudentInfoEditView.as_view(), name='student_info_edit'),
    path("parent-info/edit/<int:pk>/", ParentInfoEditView.as_view(), name='parent_info_edit'),
    path("teacher-info/edit/<int:pk>/", TeacherInfoEditView.as_view(), name='teacher_info_edit'),

    path("generate-pdf/", GeneratePdf.as_view(), name='generate_pdf'),
    path("generate-pdf/student/", GeneratePdfWithParent.as_view(), name='generate_pdf_student'),

    path('teacher-list/', TeacherListView.as_view(), name='teacher_list'),
    path('student-list/', StudentListView.as_view(), name='student_list'),
    path('parent-list/', ParentListView.as_view(), name='parent_list'),

    path('branch/user-list/', BranchUserCountView.as_view(), name='branch_user_list'),

    path('event/create/', EventCreateView.as_view(), name='event_create'),
    path('event/edit/<int:pk>/', EventUpdateView.as_view(), name='event_edit'),
    path('event/delete/<int:pk>/', EventDeleteView.as_view(), name='event_delete'),
    path('event/list/', EventListView.as_view(), name='event_list'),
    path('public-user-list/', PublicUserListView.as_view(), name='public_user_list'),
    path('dashboard/metrics/', DashboardMetricsView.as_view(), name='dashboard_metrics'),
    path('branch-metrics/<int:branch_id>/', BranchMetricsView.as_view(), name='branch-metrics'),

    # Public user endpoints
    # path('auth/public/register/', PublicUserRegistrationView.as_view(), name='public_register'),
    # path('auth/public/login/', PublicUserLoginView.as_view(), name='public_login'),
    # path('public/users/', PublicUserListView.as_view(), name='public_user_list'),
] + router.urls
