from django.contrib import admin
from .models import *

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
