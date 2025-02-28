import datetime
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from django.db import models

class UserProfile(models.Model):
    full_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    role = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    reset_token = models.CharField(max_length=255, null=True, blank=True)
    reset_token_expiration = models.DateTimeField(null=True, blank=True)

    last_login = models.DateTimeField(auto_now=True)

    def get_email_field_name(self):
        return 'email'

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):

        super().save(*args, **kwargs)

    def is_reset_token_valid(self):
        # Check if the reset token has expired
        if self.reset_token_expiration and timezone.now() < self.reset_token_expiration:
            return True
        return False


    class Meta:
        permissions = []




class Entrepreneur(models.Model):
    full_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    job_role = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    bio = models.TextField(null=True, blank=True)  # Allow blank values
    phone = models.CharField(max_length=20, null=True, blank=True)  # Allow blank values
    linkedin = models.URLField(max_length=255, null=True, blank=True)  # Allow blank values
    twitter = models.URLField(max_length=255, null=True, blank=True)  # Allow blank values
    startup_name = models.CharField(max_length=255, null=True, blank=True)  # Allow blank values
    start_date = models.DateTimeField(null=True, blank=True)  # Allow blank values
    team_size = models.IntegerField(null=True, blank=True)  # Allow blank values
    website = models.URLField(max_length=255, null=True, blank=True)  # Allow blank values
    
    # Add Profile Picture Field
    profile_picture = models.ImageField(upload_to='entrepreneur_profiles/', null=True, blank=True)
    
    # Optional fields
    reset_token = models.CharField(max_length=255, null=True, blank=True)
    reset_token_expiration = models.DateTimeField(null=True, blank=True)
    
    last_login = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

    def is_reset_token_valid(self):
        # Check if the reset token has expired
        if self.reset_token_expiration and timezone.now() < self.reset_token_expiration:
            return True
        return False

    class Meta:
        permissions = []
