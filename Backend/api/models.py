import datetime
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserProfile(models.Model):
    full_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    role = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    reset_token = models.CharField(max_length=255, null=True, blank=True)
    reset_token_expiration = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=255, null=True, blank=True, default="Active")

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
    ideas_posted = models.IntegerField(default=0)
    investor_connections = models.IntegerField(default=0)
    profile_completion = models.IntegerField(default=0)
    status = models.CharField(max_length=255, null=True, blank=True, default="Active")

    
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


class Investor(models.Model):
    full_name = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    role = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    bio = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    linkedin = models.URLField(max_length=255, null=True, blank=True)
    twitter = models.URLField(max_length=255, null=True, blank=True)
    firm_name = models.CharField(max_length=255, null=True, blank=True)
    investment_stage = models.CharField(max_length=255, null=True, blank=True)
    portfolio_size = models.IntegerField(null=True, blank=True)
    website = models.URLField(max_length=255, null=True, blank=True)
    min_investment = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    max_investment = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    sectors = models.TextField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='investor_profiles/', null=True, blank=True)
    id_document = models.FileField(upload_to='documents/', null=True, blank=True)
    status = models.CharField(max_length=255, null=True, blank=True, default="Active")

    def __str__(self):
        return self.username

    class Meta:
        permissions = []


class AdminUser(models.Model):
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)  # Store hashed password

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.username

class AdminUserManager(BaseUserManager):
    def create_user(self, username, password=None):
        user = self.model(username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

class AdminUser(AbstractBaseUser):
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)

    objects = AdminUserManager()
    
    USERNAME_FIELD = 'username'

class Event(models.Model):
    title = models.CharField(max_length=255)
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=255, null=True, blank=True, default="Active")

    def __str__(self):
        return self.title

class Idea(models.Model):
    CATEGORY_CHOICES = [
        ('tech', 'Technology'),
        ('health', 'Healthcare'),
        ('finance', 'Finance'),
        ('education', 'Education'),
        ('sustainability', 'Sustainability'),
        ('agriculture', 'Agriculture'),
        ('others', 'Others'),
    ]

    username = models.CharField(max_length=100)  # Custom username field
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    image = models.ImageField(upload_to='idea_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    like_count = models.PositiveIntegerField(default=0)  # New field for likes

    def __str__(self):
        return self.title


class Comment(models.Model):
    idea = models.ForeignKey(Idea, related_name="comments", on_delete=models.CASCADE)
    user = models.ForeignKey(Entrepreneur, on_delete=models.CASCADE)  # Assuming Django's built-in User model
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.idea.title}"