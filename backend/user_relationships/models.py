# relationships/models.py
from django.db import models
from django.conf import settings

class UserRelationship(models.Model):
    # フォロー関係のステータス定義
    STATUS_PENDING = 'pending'
    STATUS_APPROVED = 'approved'
    STATUS_DENIED = 'denied'
    STATUS_CHOICES = [
        (STATUS_PENDING, '保留中'),
        (STATUS_APPROVED, '承認済み'),
        (STATUS_DENIED, '拒否済み'),
    ]

    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='following_relationships',
        on_delete=models.CASCADE,
        verbose_name='フォローしているユーザー'
    )
    followed = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='follower_relationships',
        on_delete=models.CASCADE,
        verbose_name='フォローされているユーザー'
    )
    # 新しく追加するフィールド
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING, # デフォルトは保留中
        verbose_name='ステータス'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='作成日時')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新日時') # ステータス変更時に更新

    class Meta:
        unique_together = ('follower', 'followed')
        db_table = 'user_relationships'
        verbose_name = 'ユーザー関係'
        verbose_name_plural = 'ユーザー関係'
        ordering = ['-created_at']

    def __str__(self):
        status_display = dict(self.STATUS_CHOICES).get(self.status, self.status)
        return f"{self.follower.username} が {self.followed.username} をフォロー ({status_display})"