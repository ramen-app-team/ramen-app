from django.shortcuts import render


from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import UserSerializer, UserRegisterSerializer # 作成したシリアライザーをインポート
from .models import User

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all() # Userモデル全体を対象とする
    serializer_class = UserRegisterSerializer # 使用するシリアライザーを指定

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "ユーザー登録が完了しました。"
        }, status=status.HTTP_201_CREATED)