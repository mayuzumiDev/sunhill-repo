from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import AccountLoginView, AccountLogoutView, PasswordResetRequestView, PasswordResetVerify, PasswordResetConfirm, OTPCodeResend

urlpatterns = [
    path('account-login/', AccountLoginView.as_view(), name="account_login"),
    path('account-logout/', AccountLogoutView.as_view(), name='account_logout'),
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-verify/', PasswordResetVerify.as_view(), name='password_reset_verify'),
    path('password-reset-confirm/', PasswordResetConfirm.as_view(), name='password_reset_confirm'),
    path('otp-resend/', OTPCodeResend.as_view(), name='otp_code_resend'),
]
