from django.urls import path
from . import views
urlpatterns = [
    path('', views.home, name='home'),
    path('pricing/', views.pricing, name='pricing'),
    path('about/', views.about, name='about'),
    path('software-training/', views.software_training, name='software_training'),
    path('accounting-training/', views.accounting_training, name='accounting_training'),
    path('product/', views.product, name='product'),
    path('updates/', views.updates, name='updates'),
    path('demo/', views.demo, name='demo'),
    path('download-requirements/', views.download_requirements, name='download_requirements'),
    path('support/', views.support_panel, name='support_panel'),
    path('contact/', views.contact, name='contact'),
    path('weblug/', views.weblug, name='weblug'),
    path('setting_software/', views.setting_software, name='setting_software'),
    path('barkodKhan/', views.barkodKhan, name='barkodKhan'),
    path('excel/', views.excel, name='excel'),
    path('website_connect/', views.website_connect, name='website_connect'),
    path('banksink/', views.banksink, name='banksink'),
    path('infobazargani/',views.infobazargani, name='infobazargani'),
    path('infotolidi/',views.infotolidi, name='infotolidi'),
    path('infokhadamat/',views.infokhadamat, name='infokhadamat'),
    path('agentList/',views.agentList, name='agentList'),
    path('DEATAILWEBLUG/<int:id>/',views.DEATAILWEBLUG, name='DEATAILWEBLUG'),
    path('LASTfORM/<int:id>/',views.LASTfORM, name='LASTfORM'),
    

]
