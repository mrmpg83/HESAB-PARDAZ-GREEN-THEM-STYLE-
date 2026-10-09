from django.conf import settings
from django.db import models


class Conversation(models.Model):
    """یک گفتگوی پشتیبانی بین یک کاربر و ادمین."""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conversation',
        verbose_name='کاربر',
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')

    class Meta:
        verbose_name = 'گفتگو'
        verbose_name_plural = 'گفتگوها'
        ordering = ['-created_at']

    def __str__(self):
        return f'گفتگو با {self.user}'

    @property
    def last_message(self):
        return self.messages.order_by('-created_at').first()

    def unread_count_for_admin(self):
        return self.messages.filter(is_read=False, sender=self.user).count()

    def unread_count_for_user(self):
        return self.messages.filter(is_read=False).exclude(sender=self.user).count()


class Message(models.Model):
    """یک پیام در یک گفتگو، ارسال‌شده از سمت کاربر یا ادمین."""
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name='گفتگو',
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages',
        verbose_name='فرستنده',
    )
    text = models.TextField(verbose_name='متن پیام')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='زمان ارسال')
    is_read = models.BooleanField(default=False, verbose_name='خوانده شده')

    class Meta:
        verbose_name = 'پیام'
        verbose_name_plural = 'پیام‌ها'
        ordering = ['created_at']

    def __str__(self):
        return f'{self.sender}: {self.text[:30]}'
