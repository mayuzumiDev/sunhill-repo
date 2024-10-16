from django.urls import path
from . import views

urlpatterns = [
    path("", views.test_view, name='admin_test_view')
]
