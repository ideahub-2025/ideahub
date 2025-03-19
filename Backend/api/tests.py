# from pymongo import MongoClient
# from django.conf import settings
# from pymongo.errors import PyMongoError
# from rest_framework.response import Response
# from rest_framework import status

# MONGO_CLIENT_URL="mongodb+srv://ideahub:idea123@cluster0.uw8l5.mongodb.net/?retryWrites=true&w=majority"
# client = MongoClient(MONGO_CLIENT_URL)  # Update with your MongoDB connection string
# db = client["ideahub"]
# collection = db["api_event"]

# # Add the 'status' field to all documents
# collection.update_many({}, {"$set": {"status": "Active"}})

# print("Status column added successfully!")

import redis

r = redis.Redis(host='192.168.171.3', port=6379, decode_responses=True)

# Test Redis
r.set("test_key", "Hello, Redis!")
print(r.get("test_key"))  # Should print: Hello, Redis!
