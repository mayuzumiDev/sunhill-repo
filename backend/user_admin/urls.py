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
    path("student-info/edit/<int:pk>/", StudentInfoEditView.as_view(), name='student_info_edit'),
    path("parent-info/edit/<int:pk>/", ParentInfoEditView.as_view(), name='parent_info_edit'),
    path("teacher-info/edit/<int:pk>/", TeacherInfoEditView.as_view(), name='teacher_info_edit'),
    path("generate-pdf/", GeneratePdf.as_view(), name='generate_pdf'),
    path("generate-pdf/student/", GeneratePdfWithParent.as_view(), name='generate_pdf_student'),
    path('teacher-list/', TeacherListView.as_view(), name='teacher_list'),
    path('student-list/', StudentListView.as_view(), name='student_list'),
    path('parent-list/', ParentListView.as_view(), name='parent_list'),
    path('public-user-list/', PublicUserListView.as_view(), name='public_user_list')
]
