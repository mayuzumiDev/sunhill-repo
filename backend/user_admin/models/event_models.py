from django.db import models

TARGET_AUDIENCE_CHOICES = [
    ('students', 'Students'),
    ('teachers', 'Teachers'),
    ('parents', 'Parents'),
    ('all', 'All'),
]

BRANCH_CHOICES = [
    ('all', 'All'),
    ('batangas', 'Batangas'),
    ('rosario', 'Rosario'),
    ('bauan', 'Bauan'),
    ('metrotagaytay', 'Metro Tagaytay'),
]

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    target_audience = models.CharField(max_length=50, choices=TARGET_AUDIENCE_CHOICES)
    branch = models.CharField(max_length=50, choices=BRANCH_CHOICES, default='all')
    location = models.CharField(max_length=255, blank=True, null=True)
    attachment = models.FileField(upload_to='attachments/', blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.title

    def is_visible_to(self, user):
        """Check if event is visible to a specific user based on role and branch"""
        if not user or not user.is_authenticated:
            return False

        role_match = self.target_audience == 'all' or self.target_audience == user.role
        branch_match = self.branch == 'all' or self.branch == user.branch_name.lower()
        
        return role_match and branch_match
