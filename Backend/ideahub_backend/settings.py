import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient
import logging
from datetime import timedelta
logger = logging.getLogger("django")

load_dotenv()  # Load environment variables from .env file

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret_key")

DEBUG = True

ALLOWED_HOSTS = ["*"]



TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "api",
    "djongo",  # Added Djongo to the installed apps
    'corsheaders',
    'rest_framework_simplejwt',
     'rest_framework.authtoken',
     "django_extensions",
     
    
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'corsheaders.middleware.CorsMiddleware',
    
]

ROOT_URLCONF = "ideahub_backend.urls"

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI")  # MongoDB Atlas connection string
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
MONGO_CLIENT_URL="mongodb+srv://ideahub:idea123@cluster0.uw8l5.mongodb.net/?retryWrites=true&w=majority"
# MongoDB configuration

DATABASES = {
    "default": {
        "ENGINE": "djongo",
        "NAME": MONGO_DB_NAME,
        "ENFORCE_SCHEMA": False,
        "CLIENT": {
            "host": 'mongodb+srv://ideahub:idea123@cluster0.uw8l5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
            'serverSelectionTimeoutMS': 50000,  # Increase the timeout to 50 seconds
            'ssl': True,
        },
    }
}
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),  # Ensure "Bearer" token format
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'ideahub_backend.parsers.CamelCaseJSONParser',  # Add this to support camelCase input
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'ideahub_backend.renderers.CamelCaseJSONRenderer',  # Add this to support camelCase output
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],


}

STATIC_URL = "/static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",

]
MIGRATION_MODULES = {
    'auth': None,
    'contenttypes': None,
}



# settings.py
# Email settings in settings.py
#EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_BACKEND = "ideahub_backend.custom_email_backend.CustomEmailBackend"

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'ideahub2025@gmail.com'  # Your Gmail address
EMAIL_HOST_PASSWORD = 'fjau dyhe naos agfb'  # Your Gmail password or App Password
HOST_URL = "http://localhost:5173"  # Adjust the URL as needed
EMAIL_USE_SSL = False


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'templates',  # Add this line if your templates are in the 'templates' directory in the base folder
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]



# Media files settings
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://192.168.171.3:6379/1",  # Use your WSL IP
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

