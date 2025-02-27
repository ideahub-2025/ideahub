from django.urls import path
from .views import *

urlpatterns = [
    path('user_profiles/', UserProfileCreateView.as_view(), name='user_profiles'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('forgot-password/', forgot_password, name='forgot-password'),
    path('reset-password/<uidb64>/<token>/', reset_password, name='reset-password'),
]
