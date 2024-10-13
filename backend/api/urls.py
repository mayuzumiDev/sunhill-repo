from django.urls import path
from . import views

urlpatterns = [
    path('account-login/', views.AccountLoginView.as_view(), name="account_login"),
    path('account-logout/',  views.AccountLogoutView.as_view(), name='account_logout'),
    path('password-reset-request/', views.PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-verify/', views.PasswordResetVerify.as_view(), name='password_reset_verify'),
    path('password-reset-confirm/', views.PasswordResetConfirm.as_view(), name='password_reset_confirm'),
    path('otp-resend/', views.OTPCodeResend.as_view(), name='otp_code_resend'),
]