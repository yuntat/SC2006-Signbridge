README - SignBridge Backend (Database)

## 📌 SignBridge Backend: User Data Management
This module handles user data management for the SignBridge application. It provides API endpoints for user registration, login, retrieval, and deletion, with a focus on secure storage and access control.

## 🧱 Tech Stack
FastAPI: For building the API endpoints.

uvicorn: ASGI server to run the FastAPI application.

pymongo: Python driver for MongoDB (used to connect to Azure Cosmos DB).

python-dotenv: For loading environment variables from a .env file.

bcrypt: For hashing user passwords.

*Note:  This backend utilizes the same core technologies as the main SignBridge backend as outlined in the main README.md for consistency and maintainability.

## 🗂️ File Structure
backend/
 ├── routes/
 │   └── users.py   # API routes for user management
 ├── models.py      # Pydantic models for data structures (User)
 ├── main.py        # FastAPI application entry point
 ├── database.py    # MongoDB connection logic
 └── requirements.txt # Dependencies
*Note: This structure is a subset of the main SignBridge backend; refer to the main README.md for the full project structure.

## ⚙️ Installation & Setup

Prerequisites:

Python 3.10+ (See main README.md for general prerequisites)
MongoDB instance (or Azure Cosmos DB with MongoDB API)

1.  Clone the main repository (if you haven't already):

    ```
    git clone [https://github.com/your-username/SC2006-SignLanguageApp.git](https://github.com/your-username/SC2006-SignLanguageApp.git)
    cd SC2006-SignBridge/backend
    ```

2.  Create a `.env` file in the `backend/` directory and add your MongoDB connection string:

    ```
    COSMOS_CONNECTION_STRING="your_cosmos_db_connection_string"
    DATABASE_NAME="your_database_name"
    COLLECTION_NAME="users"

    ```

3.  Install dependencies:

    ```
    pip install -r requirements.txt
    ```

4.  Run the API:

    * **Locally (Development):**

        ```
        uvicorn main:app --reload
        ```

        This command starts the FastAPI application using the Uvicorn server.
        * `uvicorn`:  Executes the Uvicorn server.
        * `main:app`:  Specifies the `app` object in the `main.py` file as the application to run.
        * `--reload`:  Enables automatic reloading of the server when code changes are detected, which is helpful during development.

    * **Deployment Method:** Azure Web Apps
    * To deploy, using the Azure CLI:

        ```
        az webapp up --name signbridge-api --resource-group genai --runtime "PYTHON:3.11"
        ```

        * `--name`: Specifies the Azure Web App name.
        * `--resource-group`: Specifies the Azure Resource Group.
        * `--runtime`: Specifies the Python runtime.
    * **Important Notes:**
        * Ensure the Azure CLI is installed and configured.
        * Azure installs dependencies from `requirements.txt`.
        * Configure environment variables (e.g., `COSMOS_CONNECTION_STRING`) in the Azure Web App settings.

## 💾 Data Models (models.py)
UserType (Enum): Defines user roles (admin, normal).
User (BaseModel): Pydantic model for user data:
username (str): User's login name.
password (str): User's hashed password.
user_type (UserType): User's role.

## 🚀 API Endpoints (routes/users.py)
POST /users/register: Registers a new user, hashing the password before storing it.
POST /users/login: Authenticates a user by verifying the provided password against the stored hash.
GET /users/{username}: Retrieves a user's information (excluding password) by username.
DELETE /users/{username}: Deletes a user ( *Admin access should be implemented in the main backend to protect this endpoint*).

## 🧪 Testing
*Note:  API testing is covered as part of the main SignBridge application testing.  Refer to  SC2006 Project Team 4 Test Cases.pdf  for comprehensive test details.

## 🛠️ Dependencies (requirements.txt)
fastapi
uvicorn[standard]
pymongo
python-dotenv
bcrypt

## 👨‍💻 Contributors
*See the main README.md for the full list of contributors.