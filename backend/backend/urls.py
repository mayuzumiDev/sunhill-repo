from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('api.urls')),
    path('api/user-student/', include('user_student.urls')),
    path('user-admin/', include('user_admin.urls')),
    path('user-teacher/', include('user_teacher.urls')),
    path('special-education/', include('special_education.urls')),
    path('api/user-parent/', include('user_parent.urls')), 

    # Serve media files in both development and production
    path('media/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
