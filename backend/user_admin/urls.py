from django.urls import path
from .views.account.account_views_create import *
from .views.account.account_views_list import *
from .views.account.account_views_edit import *
from .views.account.pdf_accounts import *

urlpatterns = [
    path('generate-account/', GenerateAccountView.as_view(), name="generate_account" ),
    path("create-account/", CreateAccountView.as_view(), name='create_account'),
    path("custom-user/delete/", CustomUserDeleteView.as_view(), name="custom_user_delete"),
    path("custom-user/edit/<int:pk>/", CustomUserEditView.as_view(), name='custom_user_edit'),
    path("user-info/edit/<int:pk>/", UserInfoEditView.as_view(), name='user_info_edit'),
    path("generate-pdf/", GeneratePdf.as_view(), name='generate_pdf'),
    path('teacher-list/', TeacherListView.as_view(), name='teacher_list'),
    path('student-list/', StudentListView.as_view(), name='student_list')
]
