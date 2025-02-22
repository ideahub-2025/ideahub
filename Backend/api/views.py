from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from .models import UserProfile
from .serializers import UserProfileSerializer
import re
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password



class UserProfileCreateView(APIView):
    def post(self, request):
        """Handles user registration"""
        data = request.data.copy()
        print("USER REG DATA:", data)

        # Password validation
        if 'password' not in data:
            return Response({"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        password = data["password"]
        if len(password) < 8:
            return Response({"error": "Password must be at least 8 characters long"}, status=status.HTTP_400_BAD_REQUEST)
        data["password"] = make_password(password)  # Hash password before saving

        # Username validation
        if 'username' in data and UserProfile.objects.filter(username=data['username']).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Email validation
        if 'email' in data:
            email = data['email']
            if not re.match(r"[^@]+@[^@]+\.[^@]+", email):  # Simple email format check
                return Response({"error": "Invalid email format"}, status=status.HTTP_400_BAD_REQUEST)
            if UserProfile.objects.filter(email=email).exists():
                return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Serializing and saving the user profile
        serializer = UserProfileSerializer(data=data)
        if serializer.is_valid():
            instance = serializer.save()
            print(f"Instance primary key after save: {instance.pk}")  # Debugging statement
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)

        return Response({"error": "Registration failed! Please try again."}, status=status.HTTP_400_BAD_REQUEST)



class SignInView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        print("USER NAME"+str(username)+" PASSWORD"+str(password))
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserProfile.objects.get(username=username)
            print("USER ##" ,user)
            print(f"Received Password: {password}")
            print(f"Stored Password: {user.password}")
            
            print(f"Password Match: {check_password(password, user.password)}")

            # Use check_password to verify the password
            if not check_password(password, user.password):
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'role': user.role,
            }, status=status.HTTP_200_OK)

        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
