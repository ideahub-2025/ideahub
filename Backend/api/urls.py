from django.urls import path
from .views import UserProfileCreateView,SignInView

urlpatterns = [
    path('user_profiles/', UserProfileCreateView.as_view(), name='user_profiles'),
    path('signin/', SignInView.as_view(), name='signin'),
]
