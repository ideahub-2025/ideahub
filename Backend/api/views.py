from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers, viewsets, permissions, status
from django.contrib.auth.hashers import make_password
from .models import UserProfile, Entrepreneur, Investor
from .serializers import UserProfileSerializer, InvestorSerializer
import re
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.models import User
from django.conf import settings
from django.shortcuts import render
from rest_framework.decorators import api_view
from django.contrib.auth.forms import PasswordResetForm
from django.template.loader import render_to_string
import base64
from datetime import datetime
from django.http import JsonResponse
import json
from rest_framework.response import Response
from rest_framework import status
import logging
from bson.binary import Binary
logger = logging.getLogger(__name__)
from django.core.files.base import ContentFile
from rest_framework.permissions import AllowAny




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


# Password reset request API
@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    print("EMAIL",email)
    # Validate email format
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return Response({"error": "Invalid email format"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Check if email exists
        user = UserProfile.objects.get(email=email)
        print("USER",user)
    except UserProfile.DoesNotExist:
        return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)

    # Generate a token for password reset
    token = default_token_generator.make_token(user)
    print("user id",user.username)

    def urlsafe_base64_encode(data):
        # Ensure the data is in bytes before encoding
        data_bytes = data.encode('utf-8')  # Convert string to bytes
        encoded_bytes = base64.urlsafe_b64encode(data_bytes)
        return encoded_bytes.decode('utf-8')  # Decode to string for URL-safe output
    uid = urlsafe_base64_encode(str(user.username))
   # Generate the reset URL using the HOST_URL from settings.py
    reset_url = f"{settings.HOST_URL}/new-password/{uid}/{token}/"

    # Prepare the email content
    subject = "Password Reset Request"
    message = render_to_string("reset_email_templates.html", {"reset_url": reset_url})
    from_email = settings.EMAIL_HOST_USER  # Sender email from settings

    # Send the email to the user with the reset link
    send_mail(
        subject,  # Subject of the email
        message,  # Email content (HTML rendered from template)
        from_email,  # Sender email
        [user.email],  # Receiver email
        fail_silently=False,  # Raise an error if something goes wrong
        html_message=message  # HTML content for the email
    )
    return Response({"message": "Password reset email sent"}, status=status.HTTP_200_OK)


# Password reset confirmation
@api_view(['POST'])
def reset_password(request, uidb64, token):
    try:
        print("ENTERED")
        print("UID64",uidb64)
        print("TOKEN",token)
        # Decode the uid and get the user
        def urlsafe_base64_decode(encoded_string):
            # Ensure the string is in bytes and handle the padding
            padding = '=' * (4 - len(encoded_string) % 4)
            encoded_string += padding

            # Decode the base64 string (it will return bytes)
            decoded_bytes = base64.urlsafe_b64decode(encoded_string)
            
            # Only decode if the result is bytes
            if isinstance(decoded_bytes, bytes):
                return decoded_bytes.decode('utf-8')
            return decoded_bytes  # In case it's already a string
        uid = urlsafe_base64_decode(uidb64)
        print("TOKEN",uid)
        user = UserProfile.objects.get(username=uid)
        print("UID",uid)
        print("USER",user)
        # Validate the token
        if default_token_generator.check_token(user, token):
            new_password = request.data.get("new_password")

            # Validate new password length
            if not new_password or len(new_password) < 8:
                return Response({"error": "Password must contain at least one letter, one number, and one special character."}, status=status.HTTP_400_BAD_REQUEST)

            user.password=new_password
            user.save()

            return Response({"message": "Password has been reset successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class EntrepreneurProfileCreateView(APIView):

    def post(self, request):
        try:
            # Parse incoming JSON data
            data = request.data  # DRF automatically parses JSON data for you
            print("Received data:", data)  # Debugging log

            # Define mandatory fields
            required_fields = ['username', 'fullName', 'email']

            # Check for missing mandatory fields
            for field in required_fields:
                if not data.get(field):  # Checks for missing or empty values (None, "", etc.)
                    return JsonResponse({'message': f'Missing required field: {field}'}, status=400)

            # Validate startDate format (optional)
            start_date = None
            if data.get('startDate'):
                try:
                    start_date = datetime.strptime(data['startDate'], '%Y-%m-%d')
                except ValueError:
                    return JsonResponse({'message': 'Invalid start date format. Use YYYY-MM-DD.'}, status=400)

            # Validate date_of_birth format (optional)
            date_string = data.get("date_of_birth", None)
            if date_string:
                try:
                    datetime.strptime(date_string, "%Y-%m-%d")
                except ValueError:
                    return JsonResponse({'message': 'Invalid date format for date_of_birth. Use YYYY-MM-DD.'}, status=400)

            # Validate team size (optional)
            team_size = None
            if data.get("teamSize"):
                try:
                    team_size = int(data.get('teamSize'))
                except ValueError:
                    return JsonResponse({"message": "Invalid team size format. Must be an integer."}, status=400)

            # Handle optional file upload for profile picture
            if 'photo' in data and data['photo']:
                image_data = data['photo']
                # Remove the Base64 header ("data:image/jpeg;base64,")
                binary_image_data = base64.b64decode(image_data.split(',')[1])
                profile_picture = ContentFile(binary_image_data, name="profile_picture.jpg")
            else:
                profile_picture = None  # Or set to default image

            # Create Entrepreneur model instance
            entrepreneur = Entrepreneur(
                username=data['username'],
                full_name=data['fullName'],
                email=data['email'],
                job_role=data.get('job_role', ''),  # Default to empty string if missing
                location=data.get('location', ''),
                bio=data.get('bio', ''),
                phone=data.get('phone', ''),
                linkedin=data.get('linkedin', ''),
                twitter=data.get('twitter', ''),
                startup_name=data.get('startupName', ''),
                start_date=start_date,
                team_size=team_size,
                website=data.get('website', ''),
                profile_picture=profile_picture  # Optional file upload
            )

            # Save the entrepreneur profile to the database
            try:
                entrepreneur.save()
            except Exception as e:
                # Log the error with more details
                print(f"Error saving entrepreneur profile: {str(e)}")
                return JsonResponse({'message': f'Error occurred while saving profile: {str(e)}'}, status=500)

            # Return success response
            return JsonResponse({'message': 'Profile created successfully!'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body.'}, status=400)

        except Exception as e:
            # Log the exception for debugging
            print(f"Unexpected error: {str(e)}")
            return JsonResponse({'message': 'An unexpected error occurred.'}, status=500)



class InvestorViewSet(viewsets.ModelViewSet):
    queryset = Investor.objects.all()
    serializer_class = InvestorSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Investor profile created successfully!', 'data': serializer.data}, status=status.HTTP_201_CREATED)
            return Response({'message': 'Validation failed', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': 'An unexpected error occurred.', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Investor profile updated successfully!', 'data': serializer.data}, status=status.HTTP_200_OK)
            return Response({'message': 'Validation failed', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': 'An unexpected error occurred.', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response({'message': 'Investor profile deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'message': 'An unexpected error occurred.', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
