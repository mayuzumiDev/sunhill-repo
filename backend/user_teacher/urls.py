from django.urls import path, include
from .views.profile.teacher_profile_views import *
from .views.classroom.classroom_manage_views import *
from .views.classroom.classroom_list_views import *
from .views.classroom.classroom_student_views import *
from .views.classroom.materials_manage_views import *
from .views.quizzes.quiz_views import *
from .views.quizzes.question_views import *
from .views.quizzes.quiz_response_views import *
from .views.analytics.analytics import *
# from user_teacher.views.quizzes.score_list_views import *

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
    path('classroom/count/<int:branch_id>/', ClassroomCountByBranchView.as_view(), name='classroom_count_by_branch'),

    path('materials/upload/', EducationMaterialUploadView.as_view(), name="materials_upload"),
    # path('materials/edit/<int:pk>/', EducationMaterialEditView.as_view(), name='materials_edit'),
    path('materials/delete/<int:pk>/', EducationMaterialDeleteView.as_view(), name='materials_delete'),
    path('materials/list/', EducationMaterialListView.as_view(), name='materials_list'),

    path('quiz/create/', QuizCreateView.as_view(), name="quiz_create"),
    path('quiz/update/<int:pk>/', QuizUpdateView.as_view(), name='quiz_update'),
    path('quiz/delete/<int:pk>/', QuizDestroyView.as_view(), name='quiz_destroy'),
    path('quiz/list/', QuizListView.as_view(), name="quiz_list"),

    path('questions/create/', QuestionCreateView.as_view(), name='question-create'),
    path('questions/list/', QuestionListView.as_view(), name='question-list'),
    path('questions/<int:pk>/', QuestionDetailView.as_view(), name='question-detail'),

    path('quiz-responses/create/', QuizResponseCreateView.as_view(), name='quiz-response-create'),
    path('quiz-scores/list/', QuizScoreListView.as_view(), name='quiz-scores-list'),

    path('analytics/question-type-distribution/', question_type_distribution, name='question-type-distribution'),
    path('analytics/question-type-performance/', question_type_performance, name='question_type_performance'),
    path('analytics/quiz-statistics/', QuizPassFailRatioView.as_view(), name='quiz-statistics'),

    # path('scores/', QuizScoreListView.as_view(), name='quiz-scores-list'),
    # path('scores/<int:pk>/', QuizScoreDetailView.as_view(), name='quiz-score-detail'),
    # path('student/<int:student_id>/scores/', StudentQuizScoresView.as_view(), name='student-quiz-scores'),
]
