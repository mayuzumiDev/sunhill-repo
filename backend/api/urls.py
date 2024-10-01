from django.urls import path
from . import views

urlpatterns = [
    path('admin-login/', views.AdminLoginView.as_view(), name='admin_login'),
    path('admin-logout/',  views.AdminLogoutView.as_view(), name='admin_logout'),
    path('password-reset-request/', views.PasswordResetRequestView.as_view(), name='password_reset_request')
]