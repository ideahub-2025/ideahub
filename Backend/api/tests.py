
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'ideahub_backend.settings'
import django
django.setup()
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
# Then you can safely import Django models or anything else
from rest_framework.authtoken.models import Token

# Replace 'username' with the actual username of the user
user = User.objects.get(username='username')  
token, created = Token.objects.get_or_create(user=user)

print(token.key)  # This is the generated token
