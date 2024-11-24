from django.contrib import admin
from .models.classroom_models import *
from .models.quizzes_models import *

@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ('class_instructor', 'grade_level', 'class_section', 'subject_name')
    list_filter = ('grade_level', 'subject_name')
    search_fields = ('class_instructor__user__username', 'class_section', 'subject_name')

@admin.register(ClassRoomStudent)
class ClassRoomStudentAdmin(admin.ModelAdmin):
    list_display = ('classroom', 'student', 'enrollment_date', 'is_active')
    list_filter = ('is_active', 'enrollment_date')
    search_fields = ('student__user__username', 'classroom__class_section')

@admin.register(EducationMaterial)
class EducationMaterialAdmin(admin.ModelAdmin):
    list_display = ('title', 'classroom', 'material_type', 'uploaded_at', 'updated_at')
    list_filter = ('material_type', 'uploaded_at', 'classroom')
    search_fields = ('title', 'description', 'classroom__class_section')
    readonly_fields = ('uploaded_at', 'updated_at')

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'classroom', 'created_by', 'created_at', 'due_date')
    list_filter = ('classroom', 'created_at', 'due_date')
    search_fields = ('title', 'description', 'classroom__class_section')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('quiz', 'question_type', 'text')
    list_filter = ('question_type', 'quiz')
    search_fields = ('text', 'quiz__title')

@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ('question', 'text', 'is_correct')
    list_filter = ('is_correct', 'question__quiz')
    search_fields = ('text', 'question__text')

@admin.register(StudentResponse)
class StudentResponseAdmin(admin.ModelAdmin):
    list_display = ('student', 'quiz', 'classroom', 'submitted_at')
    list_filter = ('submitted_at', 'classroom', 'quiz')
    search_fields = ('student__user__username', 'quiz__title', 'classroom__class_section')
    readonly_fields = ('submitted_at',)