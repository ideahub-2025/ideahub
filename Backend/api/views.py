from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UserProfile
from .serializers import UserProfileSerializer
from django.contrib.auth.hashers import make_password

class UserProfileCreateView(APIView):
    def post(self, request):
        """Handles user registration"""
        data = request.data.copy()
        data["password"] = make_password(data["password"])  # Hash password before saving
        serializer = UserProfileSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
