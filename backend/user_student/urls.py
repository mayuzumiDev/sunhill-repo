from django.urls import path
from .views.account.account_views_list import *
from .views.classroom.student_classrooms_views import *
from .views.classroom.student_materials_views import *
from .views.quizzes.student_quizzes_views import *
from .views.quizzes.quiz_views import *

urlpatterns = [
    # Student Account Management
    path('profile/', GetCurrentStudentView.as_view(), name='student_profile'),
    path('profile/update/', StudentProfileUpdateView.as_view(), name='student_profile_update'),
    #Student Profile Management
    path('profile/image/', StudentProfileImageView.as_view(), name='student_profile_image'),

    path('classrooms/list/', StudentEnrolledClassroomsView.as_view(), name='student_classrooms'),
    path('classroom/materials/', StudentEducationMaterialListView.as_view(), name='student_classroom_materials'),

    path('quizzes/', StudentQuizListView.as_view(), name="student_quiz_list" ),

    path('quiz/<int:quiz_id>/questions/', StudentQuizQuestionsView.as_view(), name='student-quiz-questions')
]
    