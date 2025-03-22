from django.urls import path, include
from .views import InvestorProfileView, CreateEventView, UpcomingEventsView,UpdateUserProfile,InvestorsTrendingIdeaView, UpdateAdminUserView,IdeaListCreateViewpost, get_user_details, UpdateInvestorStatusView, TrendingIdeaView,UserProfileCreateView, EntrepreneurProfileView, SignInView,AdminLoginView, forgot_password, reset_password, EntrepreneurProfileCreateView,InvestorViewSet ,IdeaListCreateView,UpdateEventView, UpdateEntrepreneurStatusView
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
    path('trending-ideas/', TrendingIdeaView.as_view(), name='trending-idea'),
    path('users/', get_user_details.as_view(), name='user-details'),
    path("update-admin-user/", UpdateAdminUserView.as_view(), name="update-admin-user"),
    path('investors/<int:pk>/update-status/', UpdateInvestorStatusView.as_view(), name='update-investor-status'),
    path('entrepreneur/<int:pk>/update-status/', UpdateEntrepreneurStatusView.as_view(), name='update-entrepreneur-status'),
    path("events/create/", CreateEventView.as_view(), name="create-event"),
    path("events/<int:pk>/update/", UpdateEventView.as_view(), name="update-event"),
    # path('events/all/', AllEventsView.as_view(), name='all-events'),
    path('userprofile/<str:username>/update/', UpdateUserProfile.as_view(), name='update-user-profile'),
    path('investors-trending-ideas/', InvestorsTrendingIdeaView.as_view(), name='investors-trending-ideas'),
    path('investors-profile/', InvestorProfileView.as_view(), name='investors-profile')
  
]

