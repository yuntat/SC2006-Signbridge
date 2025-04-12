from fastapi import APIRouter, HTTPException
from models import User
from database import collection
import uuid
import bcrypt

router = APIRouter()

# Register a user with hashing of password
@router.post("/register")
async def register_user(user: User):
    existing_user = collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    new_user = {
        "username": user.username,
        "password": hashed_pw.decode('utf-8'), 
        "user_type": user.user_type,
        "userId": str(uuid.uuid4())
    }

    collection.insert_one(new_user)
    return {"message": "User registered successfully"}

# Login (verifying user password)
@router.post("/login")
async def login_user(user: User):
    db_user = collection.find_one({"username": user.username})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if bcrypt.checkpw(user.password.encode('utf-8'), db_user["password"].encode('utf-8')):
        return {
            "message": "Login successful",
            "user_type": db_user["user_type"]
        }

    raise HTTPException(status_code=401, detail="Invalid username or password")

# GetUser (based off their username)
@router.get("/{username}")
async def get_user(username: str):
    user = collection.find_one({"username": username})
    if user:
        return {
            "username": user["username"],
            "user_type": user["user_type"]
        }
    raise HTTPException(status_code=404, detail="User not found")

# DeleteUser (based off their username), should only be accesible to admin
@router.delete("/{username}")
async def delete_user(username: str):
    result = collection.delete_one({"username": username})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}
