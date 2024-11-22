from django.db import models
from api.models import UserRole, CustomUser

def get_target_audience_choices():
    """Get target audience choices from available user roles"""
    choices = [(role.value, role.name) for role in UserRole if role.value != 'public']
    choices.append(('all', 'All'))  # Add 'all' option
    return sorted(choices, key=lambda x: x[0])  # Sort for consistency

def get_branch_choices():
    """Get branch choices from existing CustomUser branches"""
    # Get unique branch names from CustomUser, excluding empty/null values
    branches = set(CustomUser.objects.exclude(branch_name__isnull=True)
                  .exclude(branch_name='')
                  .values_list('branch_name', flat=True))
    # Convert to lowercase and create choices list
    branch_choices = [('all', 'All')]  # Always include 'all' option
    branch_choices.extend((branch.lower(), branch.title()) for branch in branches if branch)
    return sorted(branch_choices, key=lambda x: x[0])  # Sort for consistency

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    target_audience = models.CharField(
        max_length=50,
        choices=get_target_audience_choices(),
        help_text="Select the target audience for this event"
    )
    branch = models.CharField(
        max_length=50,
        choices=get_branch_choices(),
        default='all',
        help_text="Select the branch for this event"
    )
    location = models.CharField(max_length=255, blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        indexes = [
            models.Index(fields=['target_audience', 'branch']),
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return self.title

    def is_visible_to(self, user):
        """Check if event is visible to given user based on role and branch"""
        # Admin users can see all events
        if user.role.lower() == UserRole.ADMIN.value.lower():
            return True
            
        # Convert target audience and branch to lowercase for comparison
        target_role = self.target_audience.lower()
        target_branch = self.branch.lower() if self.branch else 'all'
        user_role = user.role.lower()
        user_branch = user.branch_name.lower() if user.branch_name else ''
        
        # If target audience is 'all', check only branch
        if target_role == 'all':
            return target_branch == 'all' or target_branch == user_branch
            
        # Otherwise check both role and branch match
        role_matches = target_role == user_role
        branch_matches = target_branch == 'all' or target_branch == user_branch
        
        return role_matches and branch_matches

    def can_edit(self, user):
        """Check if user can edit this event"""
        if not user or not user.is_authenticated:
            return False

        # Admin can edit all events
        if user.role == 'admin':
            return True

        # Non-admin users can only edit events in their branch
        return (
            user.branch_name and 
            self.branch in ['all', user.branch_name.lower()]
        )

    def can_delete(self, user):
        """Check if user can delete this event"""
        if not user or not user.is_authenticated:
            return False

        # Admin can delete all events
        if user.role == 'admin':
            return True

        # Non-admin users can only delete their own events in their branch
        return (
            user.branch_name and 
            self.branch in ['all', user.branch_name.lower()]
        )

    def save(self, *args, **kwargs):
        """Save event and create notifications"""
        # Convert target audience and branch to lowercase
        if self.target_audience:
            self.target_audience = self.target_audience.lower()
        if self.branch:
            self.branch = self.branch.lower()
            
        # Save the event
        super().save(*args, **kwargs)
        
        # Create notifications for relevant users
        from .notification_models import EventNotification
        print(f"\nCreating notifications for event: {self.title}")
        print(f"Target audience: {self.target_audience}, Branch: {self.branch}")
        EventNotification.create_notifications_for_event(self)
