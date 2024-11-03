from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# Create a custom admin interface for CustomUser
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'username', 'email', 'role')  # Fields to show in the list view

    # Fieldsets for the edit view
    fieldsets = (
        (None, {'fields': ('username', 'password',)}),
        ('Account info', {'fields': ('first_name', 'last_name','email', 'role', 'branch_name')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser')}),
    )

admin.site.register(CustomUser, CustomUserAdmin) # Register CustomUser with the custom admin interface