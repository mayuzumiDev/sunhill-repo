from django.urls import path
from .views.account.account_views_list import StudentProfileUpdateView, StudentProfileImageView, GetCurrentStudentView

urlpatterns = [
    path('profile/', GetCurrentStudentView.as_view(), name='student_profile'),
    path('profile/update/', StudentProfileUpdateView.as_view(), name='student_profile_update'),
    path('profile/image/', StudentProfileImageView.as_view(), name='student_profile_image'),
]
    