# ramen-app/backend/users/urls.py

from django.urls import path
from .views import UserRegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView, # トークン取得 (ログイン) 用
    TokenRefreshView,    # トークン更新用
)

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # 追加
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # 追加
]