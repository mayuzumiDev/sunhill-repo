from django.urls import path
from .views.account.account_views import *
from .views.account.pdf_accounts import *

urlpatterns = [
    path('generate-account/', GenerateAccountView.as_view(), name="generate_account" ),
    path("create-account/", CreateAccountView.as_view(), name='create_account'),
    path("custom-user/delete/", CustomUserDeleteView.as_view(), name="custom-user_delete"),
    path("generate-pdf/", GeneratePdf.as_view(), name='generate_pdf'),
    path('teacher-list/', TeacherListView.as_view(), name='teacher_list')
]
