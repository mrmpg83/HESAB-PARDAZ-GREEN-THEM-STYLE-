from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from  pages.models import *

def home(request):
    return render(request, 'pages/home.html')


def pricing(request):
    return render(request, 'pages/pricing.html')


def about(request):
    return render(request, 'pages/about.html')


def software_training(request):
    return render(request, 'pages/software_training.html')


def accounting_training(request):
    return render(request, 'pages/accounting_training.html')


def product(request):
    return render(request, 'pages/product.html')


def updates(request):
    return render(request, 'pages/updates.html')


def barkodKhan(request):
    return render(request, 'pages/barkodKhan.html')

def excel(request):
    return render(request, 'pages/excel.html')

def setting_software(request):
    return render(request, 'pages/setting_software.html')

def website_connect(request):
    return render(request, 'pages/website_connect.html')

def banksink(request):
    return render(request, 'pages/banksink.html')

def infobazargani(request):
    return render(request, 'pages/infobazargani.html')

def infotolidi(request):
    return render(request, 'pages/infotolidi.html')

def infokhadamat(request):
    return render(request, 'pages/infokhadamat.html')

def download_requirements(request):
    downloadRequirements = DownloadRequirements.objects.all()
    return render(request, 'pages/download_requirements.html' , {'downloadRequirements' : downloadRequirements})

def weblug(request):
    weblugs = Weblug.objects.all()
    return render(request, 'pages/weblug.html' , {'weblugs' : weblugs})

def DEATAILWEBLUG(request, id):
    weblug = Weblug.objects.get(id = id)
    return render(request, 'pages/DEATAILWEBLUG.html' , {'weblug' : weblug})

@login_required
def support_panel(request):
    # کاربر عادی به چت پشتیبانی خودش هدایت می‌شود
    # کاربر ادمین (staff) به لیست تمام گفتگوها هدایت می‌شود
    if request.user.is_staff:
        return redirect('admin_chat_list')
    return redirect('user_chat')

@login_required
def LASTfORM(request, id):
    agent = Agent.objects.get(id=id)
    success = False

    if request.method == 'POST':
        firstName = request.POST.get('firstName')
        lastname = request.POST.get('lastname')
        businessName = request.POST.get('businessName')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        version = request.POST.get('version')

        LastForm.objects.create(
            firstName=firstName,
            lastname=lastname,
            businessName=businessName,
            phone=phone,
            address=address,
            version=version
        )
        success = True

    return render(request, 'pages/LASTfORM.html', {'agent': agent, 'success': success})

def contact(request):
    if request.method == 'POST':
        # TODO: handle the contact form submission (send email / save to DB)
        messages.success(request, 'پیام شما با موفقیت ارسال شد.')
        return redirect('contact')
    return render(request, 'pages/contact.html')

@login_required
def demo(request):
    return render(request, 'pages/demo.html')

@login_required
def agentList(request):
    agent = Agent.objects.all
    return render(request, 'pages/agentList.html' , {'agent' : agent})

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'ثبت‌نام با موفقیت انجام شد. اکنون وارد شوید.')
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'pages/register.html', {'form': form})

