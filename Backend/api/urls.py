from django.urls import path
from .views import UserProfileCreateView, SignInView, forgot_password, reset_password, EntrepreneurProfileCreateView

urlpatterns = [
    path('user_profiles/', UserProfileCreateView.as_view(), name='user_profiles'),
    path('sign_in/', SignInView.as_view(), name='sign_in'),
    path('forgot_password/', forgot_password, name='forgot_password'),
    path('reset_password/<uidb64>/<token>/', reset_password, name='reset_password'),
    path('create_entrepreneur_profile/', EntrepreneurProfileCreateView.as_view(), name='create_entrepreneur_profile'),
]
