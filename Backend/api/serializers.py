from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import UserProfile, Investor  # Ensure the correct import

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

class InvestorSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)  # ✅ Allows image files
    id_document = serializers.FileField(required=False)  # ✅ Allows document files

    class Meta:
        model = Investor
        fields = '__all__'  # Ensure all necessary fields are included