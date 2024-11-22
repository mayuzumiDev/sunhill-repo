from django.urls import path
from .views.profile.teacher_profile_views import *
from .views.classroom.classroom_manage_views import *
from .views.classroom.classroom_list_views import *

urlpatterns = [
    path('current-teacher/', GetCurrentTeacherView.as_view(), name="get_current_teacher"),
    path('profile/update/', TeacherProfileUpdateView.as_view(), name='teacher-profile-update'),
    path('profile/image/', TeacherProfileImageView.as_view(), name='teacher-profile-image'),
    
    path('classroom/create/', ClassroomCreateView.as_view(), name='classroom_create'),
    path('classroom/edit/<int:pk>/', ClassroomEditView.as_view(), name='classroom_edit'),
    path('classroom/delete/<int:pk>/', ClassroomDeleteView.as_view(), name='classroom_delete'),
    path('classroom/list/', ClassroomListView.as_view(), name='classroom_list')
]
