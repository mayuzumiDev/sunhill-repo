from rest_framework import serializers
from django.utils import timezone
from user_admin.models.event_models import Event

class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'description', 'date', 'target_audience', 'branch', 'location', 'expiry_date']
        extra_kwargs = {
            'expiry_date': {'required': False},
            'location': {'required': False},
        }
        
    #  Check that the event date is not in the past
    def validate_date(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Event date cannot be in the past")
        return value

class EventEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'description', 'date', 'target_audience', 'branch', 'location']
        extra_kwargs = {
            'title': {'required': False, 'allow_blank': True},
            'description': {'required': False, 'allow_blank': True},
            'date': {'required': False},
            'target_audience': {'required': False},
            'branch': {'required': False},
            'location': {'required': False, 'allow_blank': True},
        }

    def validate_date(self, value):
        if value and value < timezone.now():
            raise serializers.ValidationError("Event date cannot be in the past")
        return value
