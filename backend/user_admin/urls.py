from django.urls import path
from .views.account.account_views import *

urlpatterns = [
    path('generate-account/', GenerateAccountView.as_view(), name="generate_account" ),
    path("create-account/", CreateAccountView.as_view(), name='create_account'),
    path('teacher-list/', TeacherListView.as_view(), name='teacher_list')
]
