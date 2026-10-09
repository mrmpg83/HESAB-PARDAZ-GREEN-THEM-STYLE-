from django import forms
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from .models import CustomUser


class RegisterForm(forms.Form):
    """فرم دستی ثبت‌نام: نام کاربری + شماره موبایل + رمز عبور."""

    username = forms.CharField(
        label='نام کاربری',
        max_length=150,
        widget=forms.TextInput(attrs={
            'placeholder': 'نام کاربری خود را وارد کنید',
            'class': 'form-input',
        }),
    )
    phone_number = forms.CharField(
        label='شماره موبایل',
        max_length=11,
        widget=forms.TextInput(attrs={
            'placeholder': '09xxxxxxxxx',
            'class': 'form-input',
        }),
    )
    password1 = forms.CharField(
        label='رمز عبور',
        widget=forms.PasswordInput(attrs={
            'placeholder': 'رمز عبور',
            'class': 'form-input',
        }),
    )
    password2 = forms.CharField(
        label='تکرار رمز عبور',
        widget=forms.PasswordInput(attrs={
            'placeholder': 'تکرار رمز عبور',
            'class': 'form-input',
        }),
    )

    def clean_username(self):
        username = self.cleaned_data['username']
        if CustomUser.objects.filter(username=username).exists():
            raise ValidationError('این نام کاربری قبلاً ثبت شده است.')
        return username

    def clean_phone_number(self):
        phone_number = self.cleaned_data['phone_number']
        if CustomUser.objects.filter(phone_number=phone_number).exists():
            raise ValidationError('این شماره موبایل قبلاً ثبت شده است.')
        return phone_number

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        if password1:
            validate_password(password1)
        return password1

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise ValidationError('رمز عبور و تکرار آن یکسان نیستند.')
        return cleaned_data

    def save(self):
        return CustomUser.objects.create_user(
            username=self.cleaned_data['username'],
            phone_number=self.cleaned_data['phone_number'],
            password=self.cleaned_data['password1'],
        )


class LoginForm(forms.Form):
    """فرم دستی ورود: نام کاربری + رمز عبور."""

    username = forms.CharField(
        label='نام کاربری',
        widget=forms.TextInput(attrs={
            'placeholder': 'نام کاربری',
            'class': 'form-input',
        }),
    )
    password = forms.CharField(
        label='رمز عبور',
        widget=forms.PasswordInput(attrs={
            'placeholder': 'رمز عبور',
            'class': 'form-input',
        }),
    )
