from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # groups フィールドをオーバーライドし、related_name を設定
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=('groups'),
        blank=True,
        help_text=(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="users_user_groups", 
        related_query_name="user",
    )
    # user_permissions フィールドをオーバーライドし、related_name を設定
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=('user permissions'),
        blank=True,
        help_text=('Specific permissions for this user.'),
        related_name="users_user_permissions", 
        related_query_name="user",
    )

    # 必要に応じて、追加のフィールドをここに定義できます。
    created_at = models.DateTimeField(auto_now_add=True)
    
    # pass # pass は削除