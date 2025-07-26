# ramen_project/urls.py
"""
URL configuration for ramen_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include # ★ ここに 'include' を追加 ★
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # ★★★ ここから以下の行を追加またはコメント解除してください ★★★

    # ユーザー関連のAPIを /api/users/ の下に含める
    path('api/users/', include('users.urls')),

    # ラーメンログ関連のAPIを /api/ramen/ の下に含める
    path('api/ramen/', include('ramen_log.urls')),

    # フォロー/フォロワー関連のAPIを /api/relationships/ の下に含める
    path('api/relationships/', include('user_relationships.urls')),

    # DRFの認証URLが必要な場合 (simplejwtなどを使っている場合)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]