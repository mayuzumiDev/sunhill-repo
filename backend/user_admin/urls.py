from django.urls import path
from .views.account.account_views import CreateAccountView, TeacherListView

urlpatterns = [
    path("create-account/", CreateAccountView.as_view(), name='create_account'),
    path('teacher-list/', TeacherListView.as_view(), name='teacher_list')
]
