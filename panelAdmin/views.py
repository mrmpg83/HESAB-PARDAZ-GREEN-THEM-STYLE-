
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import get_user_model
from  pages.models import *

User = get_user_model()
def is_staff_user(user):
    return user.is_authenticated and user.is_staff


@user_passes_test(is_staff_user, login_url='login')
def panelAdmin (request):
    weblugs = Weblug.objects.all()
    downloadRequirements = DownloadRequirements.objects.all()
    agent = Agent.objects.all()
    lastForm = LastForm.objects.all()
    customer = Customer.objects.all()
    n = agent.count()
    w = weblugs.count()
    return render(request , 'panelAdmin/panel.html' , {'weblugs' : weblugs , 'downloadRequirements' : downloadRequirements , 'agent' : agent , 'lastForm' : lastForm , 'n' : n , 'w' : w , 'customer' : customer})

def deletelastForm (request ,id):
    lastForm = LastForm.objects.filter(id = id) 
    lastForm.delete()
    return redirect(panelAdmin)

def deleteagent (request ,id):
    agent = Agent.objects.filter(id =id)
    agent.delete()
    return redirect(panelAdmin)


@login_required
def approve_request(request, pk):
    form = get_object_or_404(LastForm, pk=pk)

    if form.is_approved:
        messages.warning(request, "این درخواست قبلاً تایید شده.")
        return redirect('panelAdmin') 

    Customer.objects.create(
        name=f"{form.firstName} {form.lastname}",
        phone=form.phone,
        PurchasedVersion=form.version,
        address=form.address,
        businessName=form.businessName,
        backupEnd="",
    )

    form.delete()

    messages.success(request, f"{form.firstName} {form.lastname} با موفقیت به مشتری تبدیل شد.")
    return redirect('panelAdmin')