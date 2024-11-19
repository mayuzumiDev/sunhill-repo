from django.db import models

TARGET_AUDIENCE_CHOICES = [
    ('students', 'Students'),
    ('teachers', 'Teachers'),
    ('parents', 'Parents'),
    ('all', 'All'),
]

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    target_audience = models.CharField(max_length=50, choices=TARGET_AUDIENCE_CHOICES)
    location = models.CharField(max_length=255, blank=True, null=True)
    attachment = models.FileField(upload_to='attachments/', blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
