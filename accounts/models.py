from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import RegexValidator
from django.db import models

phone_validator = RegexValidator(
    regex=r'^09\d{9}$',
    message='شماره موبایل باید به‌صورت 09xxxxxxxxx وارد شود.',
)


class CustomUserManager(BaseUserManager):
    """منیجر سفارشی برای مدیریت ساخت کاربر عادی و ادمین."""

    def create_user(self, username, phone_number, password=None, **extra_fields):
        if not username:
            raise ValueError('وارد کردن نام کاربری الزامی است.')
        if not phone_number:
            raise ValueError('وارد کردن شماره موبایل الزامی است.')

        user = self.model(username=username, phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('کاربر ادمین باید is_staff=True داشته باشد.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('کاربر ادمین باید is_superuser=True داشته باشد.')

        return self.create_user(username, phone_number, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):

    username = models.CharField('نام کاربری', max_length=150, unique=True)
    phone_number = models.CharField(
        'شماره موبایل', max_length=11, unique=True, validators=[phone_validator]
    )
    is_active = models.BooleanField('فعال', default=True)
    is_staff = models.BooleanField('عضو تیم پشتیبانی (ادمین)', default=False)
    date_joined = models.DateTimeField('تاریخ عضویت', auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['phone_number']

    class Meta:
        verbose_name = 'کاربر'
        verbose_name_plural = 'کاربران'

    def __str__(self):
        return self.username

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username
