from django.urls import path
from .views.account.parent_account_views import (
    CurrentParentView,
    ParentCustomUserEditView,
    ParentUserInfoEditView
)
from .views.profile.parent_profile_views import ParentProfileImageView

urlpatterns = [
    # Parent Account Management
    path('current-parent/', CurrentParentView.as_view(), name='current-parent'),
    path('profile/', CurrentParentView.as_view(), name='parent-profile'),  
    path('custom-user/edit/<str:id>/', ParentCustomUserEditView.as_view(), name='edit-parent-user'),
    path('user-info/edit/<str:user_info_id>/', ParentUserInfoEditView.as_view(), name='edit-parent-info'),
    
    # Profile Image Management
    path('user-info/profile-image/', ParentProfileImageView.as_view(), name='parent-profile-image'),
]
