from djongo import models
from django.contrib.auth.hashers import make_password
from django.utils import timezone
import datetime

class UserProfile(models.Model):
    full_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=254, unique=True)  
    role = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    reset_token = models.CharField(max_length=255, null=True, blank=True)  # Token for reset
    reset_token_expiration = models.DateTimeField(null=True, blank=True)  # Expiration date for token
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
