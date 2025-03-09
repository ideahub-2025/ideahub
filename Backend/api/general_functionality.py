from pymongo import MongoClient
from django.conf import settings
from pymongo.errors import PyMongoError
from rest_framework.response import Response
from rest_framework import status

def get_table_data(collection_name, query=None):

    try:
        client = MongoClient(settings.MONGO_URI)  # Update with your MongoDB connection string
        db = client[settings.MONGO_DB_NAME]
        collection = db[collection_name]
        
        query = query or {}
        data = list(collection.find(query))
        
    except PyMongoError as e:
        return {"status": False, "error": f"Database error: {str(e)}"}
    except Exception as e:
        return {"status": False, "error": f"Unexpected error: {str(e)}"}
    finally:
        client.close()
    
    return {"status": True, "data": data}

def update_field_by_username(collection_name, username, update_data):
    """
    Updates fields in a document by filtering with the username.

    :param collection_name: MongoDB collection name
    :param username: The username to filter the document(s)
    :param update_data: A dictionary containing the fields to update
    :return: Django REST Framework Response object with status and message
    """
    try:
        # ✅ Connect to MongoDB
        client = MongoClient(settings.MONGO_URI)
        db = client[settings.MONGO_DB_NAME]
        collection = db[collection_name]

        # ✅ Ensure `username` is provided
        if not username:
            return Response(
                {"status": False, "error": "Username is required for updating."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Ensure `update_data` is not empty
        if not update_data:
            return Response(
                {"status": False, "error": "Update data cannot be empty."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Define filter query using username
        query = {"username": username}  

        # ✅ Perform the update operation
        result = collection.update_many(query, {"$set": update_data})

        # ✅ Check how many documents were modified
        if result.modified_count > 0:
            return Response(
                {"status": True, "message": f"Updated {result.modified_count} document(s) successfully."},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"status": False, "message": "No documents matched the username or no changes were made."},
                status=status.HTTP_404_NOT_FOUND
            )

    except PyMongoError as e:
        return Response(
            {"status": False, "error": f"Database error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {"status": False, "error": f"Unexpected error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    finally:
        client.close()



def check_data_exists(collection_name, field_name, value):

    try:
        client = MongoClient(settings.MONGO_URI)
        db = client[settings.MONGO_DB_NAME]
        collection = db[collection_name]
        
        query = {field_name: value}
        document = collection.find_one(query)
        
        if document:
            return {"status": True, "data": document}
        else:
            return {"status": False, "message": "No matching document found."}
        
    except PyMongoError as e:
        return {"status": False, "error": f"Database error: {str(e)}"}
    except Exception as e:
        return {"status": False, "error": f"Unexpected error: {str(e)}"}
    finally:
        client.close()

# # Example usage:
# update_result = update_field("mycollection", {"name": "John"}, {"age": 30})
# print(update_result)

# check_result = check_data_exists("mycollection", "name", "John")
# print(check_result)

def insert_to_mongo(collection_name, data):
    import uuid

    print("######## Attempting MongoDB Insert ########")

    try:
        
        if "id" not in data or data["id"] is None:
            data["id"] = str(uuid.uuid4())
        client = MongoClient(settings.MONGO_URI)
        db = client[settings.MONGO_DB_NAME]
        collection = db[collection_name]
        

        result = collection.insert_one(data)  # Insert document

        if result.inserted_id:
            return Response(
                {   "status":True,
                    "message": "Data inserted successfully!",
                    "id": str(result.inserted_id)
                },
                status=status.HTTP_201_CREATED
            )

        else:
            return Response(
                {"status":False,"error": "Insert operation did not return an ID."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except Exception as e:
        print("MongoDB Insert Error:", str(e))  # ✅ Log error
        return Response(
            {"status":False,"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



def count_documents(collection_name, field=None, value=None):
    """
    Counts documents in a given MongoDB collection based on a field-value filter.

    :param collection_name: Name of the MongoDB collection.
    :param field: The field to filter by (optional).
    :param value: The value of the field to match (optional).
    :return: JSON Response with status, collection name, field, value, and count.
    """
    try:
        # ✅ Connect to MongoDB
        client = MongoClient(settings.MONGO_URI)
        db = client[settings.MONGO_DB_NAME]
        collection = db[collection_name]

        # ✅ Create filter query
        filter_query = {field: value} if field and value else {}
        print("###############",filter_query)
        # ✅ Get document count
        count = collection.count_documents(filter_query)

        print("COUNT####INSIDE", count)  # Debugging

        return Response(
            {
                "status": True,
                "message": "Document count retrieved successfully!",
                "collection": collection_name,
                "field": field,
                "value": value,
                "count": count
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        print("MongoDB Count Error:", str(e))  # Log the error
        return Response(
            {
                "status": False,
                "error": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def get_record_completion_percentage(collection_name, username):
    """
    Calculate the percentage of fields filled in a user's most recent record.

    :param collection_name: Name of the MongoDB collection
    :param username: The username whose record is being checked
    :return: Response object with status, message, and completion details
    """
    try:
        # Connect to MongoDB
        client = MongoClient(settings.MONGO_URI)
        db = client[settings.MONGO_DB_NAME]
        collection = db[collection_name]

        # Fetch the most recent record for the given username
        user_record = collection.find_one({"username": username}, {"_id": 0})

        # If no record exists for the user
        if not user_record:
            return Response(
                {
                    "status": True,
                    "message": f"No record found for user: {username}.",
                    "completion_percentage": 0
                },
                status=status.HTTP_200_OK
            )

        # Count total fields and filled fields
        total_fields = len(user_record)
        filled_fields = sum(1 for value in user_record.values() if value not in [None, "", []])

        # Calculate completion percentage
        completion_percentage = round((filled_fields / total_fields) * 100, 2) if total_fields else 0

        return Response(
            {
                "status": True,
                "message": "User record completion percentage calculated successfully.",
                "username": username,
                "total_fields": total_fields,
                "filled_fields": filled_fields,
                "completion_percentage": completion_percentage
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {
                "status": False,
                "error": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )