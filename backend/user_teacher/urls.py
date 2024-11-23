from django.urls import path
from .views.profile.teacher_profile_views import *
from .views.classroom.classroom_manage_views import *
from .views.classroom.classroom_list_views import *
from .views.classroom.classroom_student_views import *
from .views.classroom.materials_manage_views import *

urlpatterns = [
    path('current-teacher/', GetCurrentTeacherView.as_view(), name="get_current_teacher"),
    path('profile/update/', TeacherProfileUpdateView.as_view(), name='teacher-profile-update'),
    path('profile/image/', TeacherProfileImageView.as_view(), name='teacher-profile-image'),
    
    path('classroom/create/', ClassroomCreateView.as_view(), name='classroom_create'),
    path('classroom/edit/<int:pk>/', ClassroomEditView.as_view(), name='classroom_edit'),
    path('classroom/delete/<int:pk>/', ClassroomDeleteView.as_view(), name='classroom_delete'),
    path('classroom/list/', ClassroomListView.as_view(), name='classroom_list'),
    path('classroom/add-student/', AddStudentToClassroomView.as_view(), name='classroom_add_student'),
    path('classroom/delete-student/<int:pk>/', ClassroomStudentDeleteView.as_view(), name='classroom_delete_student'),
    path('classroom/list-student/', ClassroomStudentListView.as_view(), name='classroom_list_student'),

    path('materials/upload/', EducationMaterialUploadView.as_view(), name="materials_upload"),
    path('materials/edit/<int:pk>/', EducationMaterialEditView.as_view(), name='materials_edit'),
    path('materials/delete/<int:pk>/', EducationMaterialDeleteView.as_view(), name='materials_delete'),
    path('materials/list/', EducationMaterialListView.as_view(), name='materials_list'),
]
