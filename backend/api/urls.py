from django.urls import path
from . import views

urlpatterns = [
    path('admin-login/', views.AdminLoginView.as_view(), name='admin_login'),
    path('admin-logout/',  views.AdminLogoutView.as_view(), name='admin_logout'),
]