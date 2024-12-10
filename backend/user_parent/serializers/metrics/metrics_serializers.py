from rest_framework import serializers

class MetricsSerializer(serializers.Serializer):
    totalAssignments = serializers.IntegerField()
    upcomingTests = serializers.IntegerField()
    studentName = serializers.CharField()