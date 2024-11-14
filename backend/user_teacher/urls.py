from django.urls import path
from .views.profile.teacher_profile_views import GetCurrentTeacherView

urlpatterns = [
    path('current-teacher/', GetCurrentTeacherView.as_view(), name="get_current_teacher")
]
