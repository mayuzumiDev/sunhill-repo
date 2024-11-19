from rest_framework import serializers
from user_admin.models.event_models import Event

class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'description', 'date', 'target_audience', 'location', 'attachment', 'expiry_date']
        
    #  Check that the event date is not in the past
    def validate_date(self, value):
        from django.utils import timezone
        if value < timezone.now():
            raise serializers.ValidationError("Event date cannot be in the past")
        return value

class EventListSerializer(serializers.ModelSerializer):
    formatted_date = serializers.SerializerMethodField()
    formatted_created_at = serializers.SerializerMethodField()

    def get_formatted_date(self, obj):
        return obj.date.strftime('%d-%m-%Y')

    def get_formatted_created_at(self, obj):
        return obj.created_at.strftime('%d-%m-%Y %H:%M')

    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'date', 'target_audience', 'location', 'attachment', 'expiry_date', 'created_at', 'formatted_date', 'formatted_created_at']