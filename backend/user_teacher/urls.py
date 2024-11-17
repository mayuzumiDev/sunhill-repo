from django.urls import path
from .views.profile.teacher_profile_views import (
    GetCurrentTeacherView,
    TeacherProfileUpdateView,
    TeacherProfileImageView
)

urlpatterns = [
    path('current-teacher/', GetCurrentTeacherView.as_view(), name="get_current_teacher"),
    path('profile/update/', TeacherProfileUpdateView.as_view(), name='teacher-profile-update'),
    path('profile/image/', TeacherProfileImageView.as_view(), name='teacher-profile-image'),
]
