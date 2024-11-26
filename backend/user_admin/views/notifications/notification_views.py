from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from user_admin.models.notification_models import EventNotification
from user_admin.serializers.notifications.notification_serializers import EventNotificationSerializer
from user_admin.models.event_models import Event
from django.utils import timezone
from django.db import models
from datetime import datetime
from api.models import UserRole

class EventNotificationViewSet(viewsets.ModelViewSet):
    serializer_class = EventNotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get notifications relevant to the current user"""
        user = self.request.user
        # print(f"\nFetching notifications for user: {user.username}")
        # print(f"User details - Role: {user.role}, Branch: {user.branch_name}")
        
        # Base queryset with related event data
        queryset = EventNotification.objects.select_related('event')
        
        # Filter by user unless they are admin
        if user.role.lower() != UserRole.ADMIN.value.lower():
            queryset = queryset.filter(
                models.Q(user=user) &
                (
                    models.Q(event__target_audience__iexact='all') |
                    models.Q(event__target_audience__iexact=user.role)
                ) &
                (
                    models.Q(event__branch__iexact='all') |
                    models.Q(event__branch__iexact=user.branch_name)
                )
            )
        else:
            # Admin sees all notifications
            queryset = queryset.filter(user=user)
        
        # Filter by date if specified
        date_filter = self.request.query_params.get('date')
        if date_filter:
            try:
                filter_date = datetime.strptime(date_filter, '%Y-%m-%d').date()
                queryset = queryset.filter(event__date=filter_date)
                # print(f"Applying date filter: {filter_date}")
            except ValueError:
                print(f"Invalid date format: {date_filter}")
        
        # Order by event date and creation time
        queryset = queryset.order_by('-event__date', '-created_at')
        
        # # Log the notifications found
        # print("\nNotifications found:")
        # for notif in queryset:
        #     print(f"- Event: {notif.event.title}")
        #     print(f"  Target: {notif.event.target_audience}, Branch: {notif.event.branch}")
        #     print(f"  For user: {notif.user.username} ({notif.user.role})")
        
        return queryset

    def list(self, request, *args, **kwargs):
        """List notifications with additional context"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Count unread notifications
        unread_count = queryset.filter(is_read=False).count()
        
        return Response({
            "notifications": serializer.data,
            "unread_count": unread_count
        })

    @action(detail=False, methods=['post'])
    def mark_as_read(self, request):
        """Mark notifications as read"""
        notification_ids = request.data.get('notification_ids', [])
        if not notification_ids:
            return Response({
                "status": "error",
                "message": "No notification IDs provided"
            })
            
        # Update notifications
        notifications = self.get_queryset().filter(id__in=notification_ids)
        notifications.update(is_read=True)
        
        return Response({
            "status": "success",
            "message": "Notifications marked as read",
            "unread_count": self.get_queryset().filter(is_read=False).count()
        })
        
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read for the current user"""
        self.get_queryset().update(is_read=True)
        return Response({
            "status": "success",
            "message": "All notifications marked as read",
            "unread_count": 0
        })
        
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = self.get_queryset().filter(is_read=False).count()
        return Response({
            "status": "success",
            "unread_count": count
        })
