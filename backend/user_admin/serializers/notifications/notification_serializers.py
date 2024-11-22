from rest_framework import serializers
from user_admin.models.notification_models import EventNotification
from user_admin.serializers.events.event_list_serializers import EventListSerializer
from django.utils import timezone

class EventNotificationSerializer(serializers.ModelSerializer):
    event = EventListSerializer(read_only=True)
    created_at_formatted = serializers.SerializerMethodField()
    event_date_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = EventNotification
        fields = ['id', 'event', 'is_read', 'created_at', 'created_at_formatted', 'event_date_formatted']
        read_only_fields = ['event', 'created_at', 'created_at_formatted', 'event_date_formatted']
    
    def get_created_at_formatted(self, obj):
        """Return a human-readable format of when the notification was created"""
        return obj.created_at.strftime('%B %d, %Y %I:%M %p')
    
    def get_event_date_formatted(self, obj):
        """Return a human-readable format of the event date"""
        return obj.event.date.strftime('%B %d, %Y %I:%M %p')
