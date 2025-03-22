from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers, viewsets,generics, permissions, status
from django.contrib.auth.hashers import make_password
from .models import UserProfile, Entrepreneur, Investor, AdminUser
from .serializers import UserProfileSerializer, InvestorSerializer, EntrepreneurSerializer
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
from rest_framework.parsers import MultiPartParser, FormParser
from bson import ObjectId
from pymongo import MongoClient
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view, permission_classes
from .general_functionality import insert_to_mongo, count_documents,update_field_by_username ,get_record_completion_percentage,get_table_data
import os
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from .models import Event
from .serializers import EventSerializer

from rest_framework.authentication import TokenAuthentication
from .permissions import IsOwnerOrReadOnly

from .models import Idea
from .serializers import IdeaSerializer
from .models import Idea
from .serializers import InvestorStatusSerializer
from .serializers import EntrepreneurStatusSerializer
from rest_framework.parsers import MultiPartParser, FormParser
import redis


# Initialize Redis client
redis_client = redis.StrictRedis(host='localhost', port=6379, db=1, decode_responses=True)

class UserProfileCreateView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
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
            print(data)
            if serializer.is_valid():
                print("SERIALISER")
                instance = serializer.save()
                print(f"Instance primary key after save: {instance.pk}")  # Debugging statement
                return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
            return Response({"error": "Registration failed! Please try again."}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"error": "Registration failed! Please try again."}, status=status.HTTP_400_BAD_REQUEST)



class SignInView(APIView):
    authentication_classes = []  
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        print("USER NAME"+str(username)+" PASSWORD"+str(password))
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserProfile.objects.get(username=username)
            # user_status=user.status
            # print("STATUS",user_status)
            print("USER ##" ,user)
            print(f"Received Password: {password}")
            print(f"Stored Password: {user.password}")
            print("STATUS",user.status)
            print(f"Password Match: {check_password(password, user.password)}")
            if str(user.role).strip().lower() =='entrepreneur':
                if str(user.status).strip().lower()!="active":
                    return Response({'error': 'Your account is inactive. Please contact the administrator for assistance.'}, status=status.HTTP_401_UNAUTHORIZED)

            if str(user.role).strip().lower() =='investor':
                if str(user.status).strip().lower()=="active" or str(user.status).strip().lower()=="verified":
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'username': user.username,
                        'role': user.role,
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'contact Admin'}, status=status.HTTP_401_UNAUTHORIZED)
       
            # Use check_password to verify the password
            if not check_password(password, user.password):
                return Response({'error': 'Your account is inactive or not verified. Please contact the administrator for assistance.'}, status=status.HTTP_401_UNAUTHORIZED)
            refresh = RefreshToken.for_user(user)
            return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'username': user.username,
                    'role': user.role,
                }, status=status.HTTP_200_OK)
            return Response({'error': 'contact Admin'}, status=status.HTTP_401_UNAUTHORIZED)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


# Password reset request API
@api_view(['POST'])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
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
        #user = UserProfile.objects.filter(username=str(uid).strip()).first()
        client = MongoClient(settings.MONGO_CLIENT_URL)
        
        
        db = client[settings.MONGO_DB_NAME]  # Replace with your database name
        collection = db["api_userprofile"]  # Collection name in MongoDB

        # Query MongoDB for a document where username = "xyz"
        user = collection.find_one({"username": str(uid).strip()})
        if user:
            print("User found:", user)
            print(f"User found: {user}")
            
            #if default_token_generator.check_token(user, token):
            new_password = request.data.get("new_password")

                # Validate new password length
            if not new_password or len(new_password) < 8:
                return Response({"error": "Password must contain at least one letter, one number, and one special character."}, status=status.HTTP_400_BAD_REQUEST)
            hashed_password = make_password(new_password)

            result = collection.update_one(
                {"_id": user["_id"]},  # Find the user by their MongoDB ID
                {"$set": {"password": hashed_password}}  # Update the password field
                )
            print("RESULT",result)
            if result.modified_count > 0:
                return Response({"message": "Password has been reset successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No change to password"}, status=status.HTTP_400_BAD_REQUEST)

            
        else:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class EntrepreneurProfileCreateView(APIView):
    permission_classes = [AllowAny]
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
    parser_classes = (MultiPartParser, FormParser)  # ✅ Allows file uploads

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {'message': 'Investor profile created successfully!', 'data': serializer.data}, 
                    status=status.HTTP_201_CREATED
                )
            return Response(
                {'message': 'Validation failed', 'errors': serializer.errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'message': 'An unexpected error occurred.', 'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {'message': 'Investor profile updated successfully!', 'data': serializer.data}, 
                    status=status.HTTP_200_OK
                )
            return Response(
                {'message': 'Validation failed', 'errors': serializer.errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'message': 'An unexpected error occurred.', 'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response(
                {'message': 'Investor profile deleted successfully!'}, 
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {'message': 'An unexpected error occurred.', 'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = AdminUser.objects.get(username=username)

            # Use check_password to verify the password
            if not check_password(password, user.password):
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            return Response({
                'username': user.username,

            }, status=status.HTTP_200_OK)

        except AdminUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

logger = logging.getLogger(__name__)

class EntrepreneurProfileView(APIView):
    permission_classes = [AllowAny]
    """
    API View for retrieving entrepreneur profile details via POST request.
    Expects a JSON body with the username.
    """
    
    # permission_classes = [IsAuthenticated]  # Uncomment if authentication is needed

    def post(self, request):
        try:
            logger.info("Processing POST request in EntrepreneurProfileView.")

            # Extract the username from the request body
            username = request.data.get('username')
            if not username:
                return Response({'error': 'Username not provided'}, status=400)

            logger.info(f"Requested username: {username}")

            # Fetch entrepreneur profile using the provided username
            entrepreneur = get_object_or_404(Entrepreneur, username=username)

            # Prepare response data
            entrepreneur_data = {
                "full_name": entrepreneur.full_name,
                "username": entrepreneur.username,
                "email": entrepreneur.email,
                "job_role": entrepreneur.job_role,
                "location": entrepreneur.location,
                "bio": entrepreneur.bio,
                "phone": entrepreneur.phone,
                "linkedin": entrepreneur.linkedin,
                "twitter": entrepreneur.twitter,
                "startup_name": entrepreneur.startup_name,
                "start_date": entrepreneur.start_date,
                "team_size": entrepreneur.team_size,
                "website": entrepreneur.website,
                "ideas_posted": entrepreneur.ideas_posted,
                "investor_connections": entrepreneur.investor_connections,
                "profile_completion": entrepreneur.profile_completion,
                "profile_picture": (
                    request.build_absolute_uri(entrepreneur.profile_picture.url)
                    if entrepreneur.profile_picture else None
                ),
                "last_login": entrepreneur.last_login,
            }
            try:
                completion_percentage=0
                percent_response=get_record_completion_percentage("api_entrepreneur", username)
                completion_percentage=percent_response.data.get("completion_percentage")
                try:
                            count_update_response = update_field_by_username(
                                        "api_entrepreneur",
                                        username=username,
                                        update_data={"profile_completion": completion_percentage}
                                    )
                            print("profile_completion UPDATE RESPONSE",percent_response.data)
                except Exception as e:
                    print("ERROR OCCURED IN percent UPADATION",str(e))
            except Exception as e:
                print("ERROR OCCURED IN percent UPADATION",str(e))
            return Response(entrepreneur_data, status=200)

        except Exception as e:
            logger.error(f"API Error: {str(e)}")
            return Response({'error': 'API error', 'message': str(e)}, status=500)



class UpcomingEventsView(APIView):
    permission_classes = [AllowAny]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        print("UpcomingEventsView Initialized")  # Check if the view is created

    def get(self, request):
        upcoming_events = Event.objects.filter(date__gte=now(), status="Active").order_by('date')[:5]
        print("UPCOMING EVENT, ", upcoming_events)
        serializer = EventSerializer(upcoming_events, many=True)
        return Response(serializer.data)





class IdeaListCreateViewpost(APIView):
    parser_classes = (MultiPartParser, FormParser)  # Allow file uploads
    permission_classes = []  
    print("### INSERT POST 123 ###")  # Debugging
   
    def post(self, request, *args, **kwargs):
        print("### INSERT POST ###")  # Debugging
        print("Request Data:", request.data)  # Debugging

        try:
            # Ensure user is authenticated
            # user = request.user  
            # if not user.is_authenticated:
            #     return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

            # Prepare the idea data
            username=request.data.get("username")
            image_file = request.FILES.get("image")
            image_base64 = None
            if image_file:
                image_base64 = base64.b64encode(image_file.read()).decode('utf-8')  # Convert to Base64 string

            idea_data = {
                "username": request.data.get("username"),  # ✅ Assign the currently logged-in user
                "title": request.data.get("title"),
                "category": request.data.get("category"),
                "description": request.data.get("description"),
                "image": image_base64,  
                "created_at": datetime.utcnow().isoformat(),
                "like_count": 0
            }
            print(idea_data)
            result= insert_to_mongo("api_idea",idea_data)
            if result.get("status", True):
                count_response=count_documents("api_idea", "username",username)
                idea_count =0
                print(count_response.data)
                try:
                    if count_response.get("status", True):
                        
                        idea_count=count_response.data.get("count")
                        print("COUNT",idea_count)
                        try:
                            count_update_response = update_field_by_username(
                                        "api_entrepreneur",
                                        username=username,
                                        update_data={"ideas_posted": idea_count}
                                    )
                            print("COUNT UPDATE RESPONSE",count_update_response.data)
                        except Exception as e:
                                print("ERROR OCCURED IN COUNT UPADATION",str(e))
                except Exception as e:
                    print("ERROR OCCURED IN COUNT CALCULATION",str(e))


                
            return result
            # Serialize and save the idea
            # serializer = IdeaSerializer(data=idea_data)
            # if serializer.is_valid():
            #     serializer.save()
            #     print("### Idea Created:", serializer.data)
            #     return Response(serializer.data, status=status.HTTP_201_CREATED)
            # else:
            #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("Error:", str(e))  # Log error
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






class IdeaListCreateView(APIView):
    from bson import ObjectId  # Import ObjectId for handling MongoDB IDs
    permission_classes = [] 

    def get(self, request):
        username = request.GET.get("username", None)

        query = {"username": username} if username else {}

        # Fetch data from MongoDB
        result = get_table_data("api_idea", query)

        # Check if the result has data
        if not result.get("status", True):
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Convert ObjectId to string for each document
        ideas = result["data"]
        for idea in ideas:
            if "_id" in idea:
                idea["_id"] = str(idea["_id"])

            # Convert Base64 image to a media file and serve as URL
            # Convert Base64 image to a media file
            if "image" in idea and isinstance(idea["image"], str):
                if idea["image"].startswith("/9j/"):  # Base64 detection
                    image_filename = f"{idea['_id']}.jpg"
                    image_path = os.path.join(settings.MEDIA_ROOT, image_filename)

                    # Save Base64 as an actual image file
                    with open(image_path, "wb") as img_file:
                        img_file.write(base64.b64decode(idea["image"]))

                    # Replace Base64 data with URL
                    idea["image"] = f"{settings.MEDIA_URL}{image_filename}"
                else:
                    # If already a valid URL, keep it
                    idea["image"] = idea["image"]

        return Response({"status": True, "data": ideas}, status=status.HTTP_200_OK)



class TrendingIdeaView(APIView):
    permission_classes = []  # No authentication required
    import time
    #time.sleep(60)
    def get(self, request):
        username = request.GET.get("username")
        
        # Create a unique cache key based on the username
        cache_key = f"trending_ideas_{username if username else 'all'}"
        print("CACHE KEY",cache_key)
        # Try to get cached data
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return Response({"status": True, "data": json.loads(cached_data)}, status=status.HTTP_200_OK)

        # If not cached, fetch data from MongoDB
        query = {"username": {"$ne": username}} if username else {}
        result = get_table_data("api_idea", query)

        if not result.get("status", True):
            return Response(
                {"status": False, "message": "Error fetching data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        ideas = result.get("data", [])

        # Convert ObjectId to string and handle images
        for idea in ideas:
            if "_id" in idea:
                idea["_id"] = str(idea["_id"])

            # Convert Base64 image to a media file
            if "image" in idea and isinstance(idea["image"], str):
                if idea["image"].startswith("/9j/"):  # Base64 detection
                    image_filename = f"{idea['_id']}.jpg"
                    image_path = os.path.join(settings.MEDIA_ROOT, image_filename)

                    # Save Base64 as an actual image file
                    with open(image_path, "wb") as img_file:
                        img_file.write(base64.b64decode(idea["image"]))

                    # Replace Base64 data with URL
                    idea["image"] = f"{settings.MEDIA_URL}{image_filename}"

        # Store data in Redis with a 5-minute expiration time
        redis_client.setex(cache_key, 300, json.dumps(ideas))

        return Response({"status": True, "data": ideas}, status=status.HTTP_200_OK)


class get_user_details(APIView):
    permission_classes = []  
    def get(self, request):
        result = get_table_data("api_entrepreneur", None)
        if not result.get("status", True):
            return Response(
                {"status": False, "message": "Error fetching data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Ensure 'data' key exists and is a list
        user_data = result.get("data", [])

        # Convert ObjectId to string for each document and fix image handling
        for user in user_data:
            if "_id" in user:
                user["_id"] = str(user["_id"])

            # Convert Base64 image to a media file and serve as URL
            # Convert Base64 image to a media file
            if "image" in user and isinstance(user["image"], str):
                if user["image"].startswith("/9j/"):  # Base64 detection
                    image_filename = f"{user['_id']}.jpg"
                    image_path = os.path.join(settings.MEDIA_ROOT, image_filename)

                    # Save Base64 as an actual image file
                    with open(image_path, "wb") as img_file:
                        img_file.write(base64.b64decode(user["image"]))

                    # Replace Base64 data with URL
                    user["image"] = f"{settings.MEDIA_URL}{image_filename}"
                    print(settings.MEDIA_URL)
                else:
                    # If already a valid URL, keep it
                    user["image"] = f"{settings.MEDIA_URL}{user["image"]}"
        
        # print(user_data)

        return Response({"status": True, "data": user_data}, status=status.HTTP_200_OK)
        


class UpdateAdminUserView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []  # Open to all requests

    def put(self, request):
        try:
            data = request.data
            username = data.get("username")  # Ensure username is sent in the request
            current_password = data.get("current_password")
            new_password = data.get("new_password")

            update_field_by_username("api_adminuser",username,update_data={"password": make_password(new_password)})
            
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateInvestorStatusView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []  # Open to all requests
    def patch(self, request, pk):
        investor = get_object_or_404(Investor, pk=pk)
        serializer = InvestorStatusSerializer(investor, data=request.data, partial=True)

        if serializer.is_valid():
            new_status = serializer.validated_data.get("status")

            # Allowed transitions
            allowed_transitions = {
                
                "Unverified": ["Verified", "Rejected"],
                "Blocked": ["Verified"],
                "Rejected": ["Verified"],
                "Active":["Verified", "Rejected"],
            }

            if investor.status in allowed_transitions and new_status not in allowed_transitions[investor.status]:
                return Response({"error": "Invalid status transition"}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            try:
                update_field_by_username(
                                        "api_userprofile",
                                        username=investor.username,
                                        update_data={"status": new_status}
                                    )
            except:
                pass
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateEntrepreneurStatusView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []  # Open to all requests
    print("ENTREPRENUER############")
    def patch(self, request, pk):

        entrepreneur = get_object_or_404(Entrepreneur, pk=pk)
        print("USERNAME",entrepreneur.username)
        serializer = EntrepreneurStatusSerializer(entrepreneur, data=request.data, partial=True)

        if serializer.is_valid():
            new_status = serializer.validated_data.get("status")

            # Allowed transitions
            allowed_transitions = {
                "Active": ["Inactive"],
                "Inactive": ["Active"],
            }

            if entrepreneur.status in allowed_transitions and new_status not in allowed_transitions[entrepreneur.status]:
                return Response({"error": "Invalid status transition"}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            try:
                update_field_by_username(*

                                        "api_userprofile",
                                        username=entrepreneur.username,
                                        update_data={"status": new_status}
                                    )
            except:
                pass
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateEventView(generics.CreateAPIView):
    authentication_classes = []  # No authentication required
    permission_classes = []  # Open to all requests
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save()
            return Response(
                {
                    "message": "Event created successfully",
                    "event": EventSerializer(event).data,  # Return formatted date
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateEventView(generics.UpdateAPIView):
    authentication_classes = []  # No authentication required
    permission_classes = []  # Open to all requests
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            event = serializer.save()
            return Response(
                {"message": "Event updated successfully", "event": EventSerializer(event).data},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class AllEventsView(APIView):
#     permission_classes = [AllowAny]
#     authentication_classes = [] 
    
#     def __init__(self, **kwargs):
#         super().__init__(**kwargs)
#         print("UpcomingEventsView Initialized")  # Check if the view is created
#     def get(self, request):
#         events = Event.objects.all().order_by('-date')  # Fetch all events
#         print("ALL EVENTS: ", events)
#         serializer = EventSerializer(events, many=True)
#         return Response(serializer.data)


class UpdateUserProfile(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []  # Open to all requests
    parser_classes = [MultiPartParser, FormParser]  # ✅ Allow file uploads

    def patch(self, request, username):
        print("INSIDEEE")
        entrepreneur = get_object_or_404(Entrepreneur, username=username)
        print("USERNAME:", entrepreneur.username)

        data = request.data.copy()  # ✅ Make mutable copy
        print("Incoming Data:", data)

        # ✅ Handle profile_picture properly
        if "profile_picture" in request.FILES:
            entrepreneur.profile_picture = request.FILES["profile_picture"]

        serializer = EntrepreneurStatusSerializer(entrepreneur, data=data, partial=True)
        print("SERIALIZER:", serializer)

        if serializer.is_valid():
            print("Serializer is valid. Saving data.")
            serializer.save()

            try:
                update_field_by_username(
                    "api_entrepreneur",
                    username=entrepreneur.username,
                    update_data=data
                )
            except Exception as e:
                print("Error updating MongoDB:", str(e))

            return Response(serializer.data, status=status.HTTP_200_OK)

        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)