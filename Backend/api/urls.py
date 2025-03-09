from django.urls import path, include
from .views import UpcomingEventsView,IdeaListCreateViewpost,  UserProfileCreateView, EntrepreneurProfileView, SignInView,AdminLoginView, forgot_password, reset_password, EntrepreneurProfileCreateView,InvestorViewSet ,IdeaListCreateView
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
    path('admin_login/', AdminLoginView.as_view()),
    path('entrepreneur/profile/', EntrepreneurProfileView.as_view(), name='entrepreneur-profile'),
    path('events/upcoming/', UpcomingEventsView.as_view(), name='upcoming-events'),
    path('ideas/', IdeaListCreateView.as_view(), name='idea-list-create'),
     path('ideas_post/', IdeaListCreateViewpost.as_view(), name='idea-list-create-post'),
    
]
