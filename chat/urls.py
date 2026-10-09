from django.urls import path
from . import views

urlpatterns = [
    # صفحات کامل چت (اختیاری، در کنار پنل شناور قابل استفاده هستند)
    path('chat/', views.user_chat, name='user_chat'),
    path('admin-chat/', views.admin_chat_list, name='admin_chat_list'),
    path('admin-chat/<int:pk>/', views.admin_chat_detail, name='admin_chat_detail'),
]
