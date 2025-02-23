from djongo import models

from django.contrib.auth.hashers import make_password

class UserProfile(models.Model):
    full_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=254, unique=True)  
    role = models.CharField(max_length=100)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    class Meta:
        permissions = []
