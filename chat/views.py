import json

from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import get_user_model
from django.views.decorators.http import require_POST

from .models import Conversation, Message
from .forms import MessageForm

User = get_user_model()


def is_staff_user(user):
    return user.is_authenticated and user.is_staff


def serialize_message(message, viewer):
    """تبدیل یک پیام به دیکشنری برای پاسخ JSON."""
    return {
        'id': message.id,
        'text': message.text,
        'sender': message.sender.username,
        'is_mine': message.sender_id == viewer.id,
        'created_at': message.created_at.strftime('%Y/%m/%d %H:%M'),
    }


@login_required
def user_chat(request):
    """پنل چت کاربر عادی با پشتیبانی (ادمین)."""
    # اگر کاربر ادمین بود، به لیست گفتگوهای پشتیبانی هدایت شود
    if request.user.is_staff:
        return redirect('admin_chat_list')

    conversation, _ = Conversation.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        form = MessageForm(request.POST)
        if form.is_valid():
            message = form.save(commit=False)
            message.conversation = conversation
            message.sender = request.user
            message.save()
            return redirect('user_chat')
    else:
        form = MessageForm()

    # پیام‌های ارسالی توسط ادمین، هنگام مشاهده کاربر، خوانده‌شده علامت زده می‌شود
    conversation.messages.exclude(sender=request.user).update(is_read=True)

    return render(request, 'chat/user_chat.html', {
        'conversation': conversation,
        'messages_list': conversation.messages.select_related('sender'),
        'form': form,
    })


@user_passes_test(is_staff_user, login_url='login')
def admin_chat_list(request):
    """لیست تمام گفتگوهای پشتیبانی، مخصوص ادمین."""
    conversations = Conversation.objects.select_related('user').all()
    return render(request, 'chat/admin_chat_list.html', {
        'conversations': conversations,
    })


@user_passes_test(is_staff_user, login_url='login')
def admin_chat_detail(request, pk):
    """مشاهده و پاسخ به یک گفتگوی مشخص، مخصوص ادمین."""
    conversation = get_object_or_404(Conversation, pk=pk)

    if request.method == 'POST':
        form = MessageForm(request.POST)
        if form.is_valid():
            message = form.save(commit=False)
            message.conversation = conversation
            message.sender = request.user
            message.save()
            return redirect('admin_chat_detail', pk=pk)
    else:
        form = MessageForm()

    # پیام‌های ارسالی توسط کاربر، هنگام مشاهده ادمین، خوانده‌شده علامت زده می‌شود
    conversation.messages.filter(sender=conversation.user).update(is_read=True)

    return render(request, 'chat/admin_chat_detail.html', {
        'conversation': conversation,
        'messages_list': conversation.messages.select_related('sender'),
        'form': form,
    })
