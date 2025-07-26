from rest_framework import generics
from rest_framework.response import Response
from .models import RamenLog
from .serializers import RamenLogSerializer
from .nulldata import default_ramen_log

class RamenLogListCreateAPIView(generics.ListCreateAPIView):
    queryset = RamenLog.objects.all().order_by('-visited_at')
    serializer_class = RamenLogSerializer

class RamenLogRetrieveAPIView(generics.RetrieveAPIView):
    queryset = RamenLog.objects.all()
    serializer_class = RamenLogSerializer

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        # visited_at が None の場合は初期データを返す
        if instance.visited_at is None:
            return Response(default_ramen_log)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# 追加：削除用ビュー
class RamenLogDestroyAPIView(generics.DestroyAPIView):
    queryset = RamenLog.objects.all()
    serializer_class = RamenLogSerializer
