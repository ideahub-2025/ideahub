from djongo import models

class UserProfile(models.Model):
    full_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    role = models.CharField(max_length=100)
    password = models.CharField(max_length=255)  # Store hashed password
   
