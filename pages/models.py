from django.db import models

# Create your models here.
class Weblug(models.Model) :
    title = models.CharField(max_length=100)
    date =models.CharField(max_length=10)
    virast = models.CharField(max_length=100)
    daste = models.CharField(max_length=30)
    minp = models.CharField(max_length=200)

    img1 = models.CharField(max_length=150)
    titr1 =models.CharField(max_length=150)
    paragraph1 = models.TextField()


    img2 = models.CharField(max_length=150,blank=True ,null=True)
    titr2 =models.CharField(max_length=150 ,blank=True ,null=True)
    paragraph2 = models.TextField(blank=True ,null=True)



    img3 = models.CharField(max_length=150,blank=True ,null=True)
    titr3 =models.CharField(max_length=150 ,blank=True ,null=True)
    paragraph3 = models.TextField(blank=True ,null=True)


    img4 = models.CharField(max_length=150,blank=True ,null=True)
    titr4 =models.CharField(max_length=150 ,blank=True ,null=True)
    paragraph4 = models.TextField(blank=True ,null=True)
    
class Agent(models.Model):
    firstName =models.CharField(max_length=50)
    lastName =models.CharField(max_length=50)
    ostan =models.CharField(max_length=50)
    address =models.TextField()
    phoneNumber =models.CharField(max_length=11)
    decryption =models.TextField()
    img = models.URLField(blank=True ,null=True)


class LastForm(models.Model):
    firstName =models.CharField(max_length=50)
    lastname =models.CharField(max_length=50)
    address =models.TextField()
    phone =models.CharField(max_length=11)
    businessName =models.CharField(max_length=50)
    version =models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)


class DownloadRequirements(models.Model):
    nameApp = models.CharField(max_length=100)
    description = models.CharField(max_length=50)
    download1 = models.URLField(blank=True ,null=True)
    download2 = models.URLField(blank=True ,null=True)


class Customer(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=11)
    PurchasedVersion = models.CharField(max_length=50)
    address =models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    backupEnd = models.CharField(max_length=10)
    businessName =models.CharField(max_length=50)