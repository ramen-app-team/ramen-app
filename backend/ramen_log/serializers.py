from rest_framework import serializers
from .models import RamenLog

class RamenLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RamenLog
        fields = '__all__'
