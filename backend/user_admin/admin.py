from django.contrib import admin
from .models.account_models import UserInfo, StudentInfo, ParentInfo

class UserInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'contact_no', 'profile_image',)
    fieldsets = (
        (None, {'fields': ('contact_no',)}),
    )

class StudentInfoAdmin(UserInfoAdmin):
    list_display = ('id', 'student_info', 'grade_level',)
    fieldsets = UserInfoAdmin.fieldsets + (
        ('Student', {'fields': ('grade_level',)}),
    )

class ParentInfoAdmin(UserInfoAdmin):
    list_display = ('id', 'parent_info', 'student_info')
    fieldsets = UserInfoAdmin.fieldsets

admin.site.register(UserInfo, UserInfoAdmin)
admin.site.register(StudentInfo,  StudentInfoAdmin)  
admin.site.register(ParentInfo, ParentInfoAdmin)

