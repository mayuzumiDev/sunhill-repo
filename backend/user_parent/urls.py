from django.urls import path
from .views.account.parent_account_views import (
    CurrentParentView,
    ParentCustomUserEditView,
    ParentUserInfoEditView,
    ParentProfileUpdateView
)
from .views.profile.parent_profile_views import ParentProfileImageView

urlpatterns = [
    # Parent Account Management
    path('profile/', CurrentParentView.as_view(), name='parent-profile'),
    path('profile/update/', ParentProfileUpdateView.as_view(), name='update-parent-profile'),
    path('custom-user/edit/<str:id>/', ParentCustomUserEditView.as_view(), name='edit-parent-user'),
    path('user-info/edit/<str:user_info_id>/', ParentUserInfoEditView.as_view(), name='edit-parent-info'),
    
    # Profile Image Management
    path('profile/image/', ParentProfileImageView.as_view(), name='parent-profile-image'),
]
