from pymongo import MongoClient
from django.conf import settings
from pymongo.errors import PyMongoError
from rest_framework.response import Response
from rest_framework import status

MONGO_CLIENT_URL="mongodb+srv://ideahub:idea123@cluster0.uw8l5.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(MONGO_CLIENT_URL)  # Update with your MongoDB connection string
db = client["ideahub"]
collection = db["api_entrepreneur"]

# Add the 'status' field to all documents
collection.update_many({}, {"$set": {"status": "Active"}})

print("Status column added successfully!")

