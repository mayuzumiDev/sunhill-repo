from django.db import models
from django.utils import timezone
from api.models import CustomUser, UserRole
from .event_models import Event
from django.db.models import Q

class EventNotification(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='notifications')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='event_notifications')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Event notification for {self.user.email} - {self.event.title}"

    @classmethod
    def create_notifications_for_event(cls, event):
        """Create notifications for all relevant users based on target audience and branch"""
        print(f"\nCreating notifications for event: {event.title}")
        print(f"Event details - Target: {event.target_audience}, Branch: {event.branch}")
        
        # Query users based on target audience and branch
        users_query = CustomUser.objects.filter(is_active=True)
        
        # Convert target audience and branch to lowercase for comparison
        target_role = event.target_audience.lower()
        target_branch = event.branch.lower() if event.branch else 'all'
        
        # For 'all' target audience, include all users from the specified branch
        if target_role == 'all':
            users_query = users_query.filter(
                models.Q(role=UserRole.ADMIN.value) |
                models.Q(branch_name__iexact=target_branch) if target_branch != 'all'
                else models.Q()
            )
        else:
            # For specific target audience, include:
            # 1. Admin users (they see all events)
            # 2. Users with matching role and branch
            users_query = users_query.filter(
                models.Q(role=UserRole.ADMIN.value) |
                (
                    models.Q(role__iexact=target_role) &
                    (
                        models.Q(branch_name__iexact=target_branch) if target_branch != 'all'
                        else models.Q()
                    )
                )
            )
        
        # Log the users who will receive notifications
        print("\nUsers receiving notifications:")
        for user in users_query:
            print(f"- {user.username} (Role: {user.role}, Branch: {user.branch_name})")
        
        # Create notifications
        notifications = []
        for user in users_query:
            notifications.append(cls(event=event, user=user))
            
        # Bulk create notifications
        if notifications:
            cls.objects.bulk_create(notifications)
            print(f"\nCreated {len(notifications)} notifications for event {event.title}")
        else:
            print("\nNo notifications created - no matching users found")
