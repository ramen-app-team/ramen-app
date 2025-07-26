from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import RamenLog
from .serializers import RamenLogSerializer
from .nulldata import default_ramen_log

class RamenLogListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = RamenLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """認証されたユーザーのログのみを返す"""
        return RamenLog.objects.filter(user=self.request.user).order_by('-visited_at')

    def perform_create(self, serializer):
        """ログ作成時にリクエストユーザーを自動で割り当てる"""
        serializer.save(user=self.request.user)

class RamenLogRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = RamenLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        # visited_at が None の場合は初期データを返す
        if instance.visited_at is None:
            return Response(default_ramen_log)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# 追加：削除用ビュー
class RamenLogDestroyAPIView(generics.DestroyAPIView):
    serializer_class = RamenLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """認証されたユーザーのログのみを削除可能にする"""
        return RamenLog.objects.filter(user=self.request.user)
