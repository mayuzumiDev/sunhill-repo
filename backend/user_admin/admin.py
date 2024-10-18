from django.contrib import admin
from .models.account_models import UserInfo, StudentInfo

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

admin.site.register(UserInfo, UserInfoAdmin)
admin.site.register(StudentInfo,  StudentInfoAdmin)  

