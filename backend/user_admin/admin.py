from django.contrib import admin
from .models.account_models import *

class UserInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'contact_no', 'profile_image',)
    fieldsets = (
        (None, {'fields': ('contact_no',)}),
    )

class TeacherInfoAdmin(UserInfoAdmin):
    list_display = ('id', 'teacher_info', 'staff_position')
    fieldsets = (
        (None, {'fields': ('teacher_info', 'staff_position')}),
    )

class StudentInfoAdmin(UserInfoAdmin):
    list_display = ('id', 'student_info', 'grade_level',)
    fieldsets = (
        ('Student', {'fields': ('grade_level',)}),
    )

class ParentInfoAdmin(UserInfoAdmin):
    list_display = ('id', 'parent_info',)
    fieldsets = (
        ('Parent', {'fields': ('parent_info',)}),
    )

admin.site.register(UserInfo, UserInfoAdmin)
admin.site.register(TeacherInfo, TeacherInfoAdmin)
admin.site.register(StudentInfo, StudentInfoAdmin)  
admin.site.register(ParentInfo, ParentInfoAdmin)

