# ramen-app/backend/users/serializers.py

from rest_framework import serializers
from .models import User # あなたが定義したUserモデルをインポート

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'created_at'] # APIで公開したいフィールドを指定
        read_only_fields = ['created_at'] # 作成日時は読み取り専用

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) # パスワードは書き込み専用

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        read_only_fields = ['created_at'] # 作成日時は読み取り専用

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user