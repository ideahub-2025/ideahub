from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["ideahub"]

# Define collections with schema validation where applicable
db.create_collection("investors")
db.create_collection("ideas")
db.create_collection("investments")
db.create_collection("milestones")
db.create_collection("notifications")
db.create_collection("chats")
db.create_collection("follows")
db.create_collection("reports")
db.create_collection("admin_managements")
db.create_collection("admins")
#test
# Sample index creation
db.investors.create_index("user_id")
db.ideas.create_index("user_id")
db.investments.create_index("investor_id")
db.milestones.create_index("investment_id")
db.notifications.create_index("user_id")
db.chats.create_index("user_id")
db.follows.create_index("follower_id")
db.reports.create_index("reported_by")
db.admin_managements.create_index("admin_id")
db.admins.create_index("admin_management_id")

print("Collections and indexes created successfully in ideahub database!")
