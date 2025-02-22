from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import UserProfile  # Ensure the correct import

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

    # def create(self, validated_data):
    #     password = validated_data.pop('password')
    #     # Hash the password before saving
    #     validated_data['password'] = make_password(password)
    #     user_profile = UserProfile.objects.create(**validated_data)
    #     return user_profile