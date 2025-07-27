from rest_framework import serializers
from .models import RamenLog

class RamenLogSerializer(serializers.ModelSerializer):
    # userフィールドは読み取り専用とし、ユーザー名を表示する
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = RamenLog
        fields = '__all__'
