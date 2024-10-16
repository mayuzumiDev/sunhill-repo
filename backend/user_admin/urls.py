from django.urls import path
from .views.account.account_views import CreateAccountView

urlpatterns = [
    path("create-account/", CreateAccountView.as_view(), name='create_account')
]
