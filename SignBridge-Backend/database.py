import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Load environment variables
COSMOS_CONNECTION_STRING = os.getenv("COSMOS_CONNECTION_STRING")
DATABASE_NAME = os.getenv("DATABASE_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

# Connecting to Azure Cosmos DB
client = MongoClient(COSMOS_CONNECTION_STRING)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]
