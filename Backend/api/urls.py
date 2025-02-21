from django.urls import path
from .views import UserProfileCreateView

urlpatterns = [
    path("user_profiles/", UserProfileCreateView.as_view(), name="user_profiles"),
]
