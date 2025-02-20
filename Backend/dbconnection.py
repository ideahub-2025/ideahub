from pymongo import MongoClient
from config import *

# MongoDB Compass Connection URL
mongo_url = "mongodb+srv://" + DB_USERNAME + ":" + DB_PASSWORD + "@cluster0.uw8l5.mongodb.net/"

# Connect to MongoDB
client = MongoClient(mongo_url)


# Select Database
db = client[DB_NAME]

def insert_to_table(table_name,insert_data):
    # Select Collection
    collection = db[table_name]
    status = {
            "success": False,
            "message": "Unexpected error occured"
        }
    # Insert a Document
    try:
        # Insert a Document
        result = collection.insert_one(insert_data)

        if result.inserted_id:
            status = {
                "success": True,
                "message": "Document inserted successfully.",
                "inserted_id": str(result.inserted_id)
            }
        else:
            status = {
                "success": False,
                "message": "Document insertion failed."
            }
    except Exception as e:
        status = {
            "success": False,
            "message": f"An error occurred: {str(e)}"
        }
    return status
