from django.contrib import admin
from .models import (
    TeacherInfo,
    StudentInfo,
    ParentInfo
)

class TeacherInfoInline(admin.StackedInline):
    model = TeacherInfo
    can_delete = False

class TeacherInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'first_name', 'last_name')

    fieldsets = (
        ('Teacher Info', {'fields': ('first_name', 'last_name')}),
    )

class StudentInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'first_name', 'last_name',  'grade_level')

    fieldsets = (
        ('Student Info', {'fields': ('first_name', 'last_name',  'grade_level')}),
    )

class ParentInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'first_name', 'last_name',  'contact_no')

    fieldsets = (
        ('Parent Info', {'fields': ('first_name', 'last_name',  'contact_no')}),
    )

admin.site.register(TeacherInfo, TeacherInfoAdmin)  
admin.site.register(StudentInfo,  StudentInfoAdmin)  
admin.site.register(ParentInfo, ParentInfoAdmin)
