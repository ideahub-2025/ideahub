from django.urls import path, include
from .views import UserProfileCreateView, SignInView, forgot_password, reset_password, EntrepreneurProfileCreateView,InvestorViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'investors', InvestorViewSet)

urlpatterns = [
    path('user_profiles/', UserProfileCreateView.as_view(), name='user_profiles'),
    path('sign_in/', SignInView.as_view(), name='sign_in'),
    path('forgot_password/', forgot_password, name='forgot_password'),
    path('reset_password/<uidb64>/<token>/', reset_password, name='reset_password'),
    path('create_entrepreneur_profile/', EntrepreneurProfileCreateView.as_view(), name='create_entrepreneur_profile'),
    path('', include(router.urls)),
]
