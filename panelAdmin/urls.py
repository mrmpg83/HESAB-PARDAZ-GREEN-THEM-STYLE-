from django.urls import path
from . import views

urlpatterns = [
    # صفحات کامل چت (اختیاری، در کنار پنل شناور قابل استفاده هستند)
    path('panelAdmin/', views.panelAdmin, name='panelAdmin'),
    path('deletelastForm/<int:id>',views.deletelastForm,name='deletelastForm'),
    path('deleteagent/<int:id>',views.deleteagent,name='deleteagent'),
    path('requests/<int:pk>/approve/', views.approve_request, name='approve_request'),

]