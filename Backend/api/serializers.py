from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"

    def validate_password(self, value):
        """Ensure the password meets security requirements."""
        if len(value) < 8 or not any(char.isdigit() for char in value) or not any(char in "@$!%*?&" for char in value):
            raise serializers.ValidationError("Password must be at least 8 characters long, include one number, and one special character.")
        return value
