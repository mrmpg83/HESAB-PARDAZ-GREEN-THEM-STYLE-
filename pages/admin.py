from django.contrib import admin
from .models import Weblug , Agent , DownloadRequirements , Customer

# Register your models here.
admin.site.register(Weblug)
admin.site.register(Agent)
admin.site.register(DownloadRequirements)
admin.site.register(Customer)