from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import UserProfile, Investor, Entrepreneur # Ensure the correct import
from .models import Event
from .models import Idea

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

class EntrepreneurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrepreneur
        fields = '__all__'




class EventSerializer(serializers.ModelSerializer):
    formatted_date = serializers.SerializerMethodField()

    def get_formatted_date(self, obj):
        return obj.date.strftime("%B %d, %Y")  # Example: "May 15, 2025"

    class Meta:
        model = Event
        fields = '__all__'


class IdeaSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()  
    class Meta:
        model = Idea
        fields = '__all__'  

