import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

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
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "ideahub_backend.urls"

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI")  # MongoDB Atlas connection string
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

# MongoDB configuration

DATABASES = {
    "default": {
        "ENGINE": "djongo",
        "NAME": MONGO_DB_NAME,
        "ENFORCE_SCHEMA": False,
        "CLIENT": {
            "host": 'mongodb+srv://ideahub:idea123@cluster0.uw8l5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
,
            'serverSelectionTimeoutMS': 50000,  # Increase the timeout to 50 seconds
            'ssl': True,
        },
    }
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}

STATIC_URL = "/static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
