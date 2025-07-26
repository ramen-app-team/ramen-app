# relationships/serializers.py
from rest_framework import serializers
from .models import UserRelationship
from django.contrib.auth import get_user_model # カスタムUserモデルを取得

User = get_user_model() # 現在のプロジェクトのUserモデルを取得

# ユーザーの詳細情報を表示するためのシリアライザ
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email'] # 必要に応じて追加のフィールドを含める

class UserRelationshipSerializer(serializers.ModelSerializer):
    # followerとfollowedの情報をネストして表示
    follower = UserSerializer(read_only=True)
    followed = UserSerializer(read_only=True)

    class Meta:
        model = UserRelationship
        fields = ['id', 'follower', 'followed', 'created_at']
        read_only_fields = ['follower', 'created_at'] # followerはリクエストからは受け取らない

class FollowRequestSerializer(serializers.Serializer):
    """フォローリクエスト用のシリアライザ (フォローするユーザーIDのみを受け取る)"""
    user_id = serializers.IntegerField(help_text="フォローしたいユーザーのID")

class FollowApprovalSerializer(serializers.Serializer):
    """フォロー承認/拒否用のシリアライザ"""
    action = serializers.ChoiceField(choices=[('approve', '承認'), ('deny', '拒否')], help_text="アクション: 'approve' または 'deny'")