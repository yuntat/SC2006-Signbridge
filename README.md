# 📱 SignBridge – Bridging Deaf and the World

[🔗 Visit Live Website](https://nice-sand-0630da700.6.azurestaticapps.net/) 


## 📌 Project Overview
[![Watch the video](https://tse3.mm.bing.net/th?id=OIP.EnDOzvJ0__c4MA7Tz-OlywHaHa&w=474&h=474&c=7)](https://youtu.be/Fmkda6RvcJQ?si=TBu15kzDa6HJaf5-)


**SignBridge** is a cross-platform mobile web app built with React Native (Expo) and Flask backend. It empowers communication between deaf and hearing individuals through AI-powered real-time gesture recognition, video translation, and text-to-sign conversion. The system includes built-in admin moderation tools and multilingual support for increased accessibility.

---

## 👥 Target Users

- **Deaf and Hard of Hearing Individuals**
- **Family Members and Friends**
- **Educators, Interpreters, and Students**

---

## ✨ Key Features

- 🧠 **AI-powered Real-time Translation** – Instantly convert live sign gestures to text.
- 📹 **Pre-recorded Video Upload** – Analyze existing videos to extract and translate signs.
- ✍️ **Text-to-Sign Output** – Translate typed sentences into animated sign language.
- 🌐 **Multilingual Support** – Supports ASL with plans to include BSL, CSL, etc.
- 🛡️ **Admin Moderation Tools** – Manage content, flag misuse, and enhance translation accuracy.
- ⚙️ **Customizable UI** – Dark mode, font scaling, and layout personalization.
- 📁 **Translation History & Export** – Save, search, or export translations to TXT/PDF formats.

---

## 🧱 Tech Stack

| Layer             | Technology                                      |
|-------------------|-------------------------------------------------|
| Frontend          | React Native (Expo)                             |
| Backend           | Flask (Python)                                  |
| Database          | MongoDB                                         |
| Hosting           | Microsoft Azure (Static Web Apps + VM)          |
| CI/CD             | GitHub Actions                                  |
| Authentication    | MongoDB-based Custom Auth                       |
| AI Inference      | Azure-hosted ML API for gesture recognition     |
| API Gateway       | Azure API Management                            |

---

## 📂 Folder Structure

```
SC2006-SIGNBRIDGE/
├── .github/                              # GitHub Actions workflows
├── assets/                               # App images, fonts, icons
├── backend/                              # Flask backend (API, models, database connection)
│   └── routes/                           # Route definitions for Flask API
├── components/                           # Reusable UI components (buttons, inputs, etc.)
├── constants/                            # Static values (colors, text config, etc.)
├── deliverables/                         # SC2006 Lab Deliverables
├── dist/                                 # Web build output (from `expo export`)
├── navigation/                           # Navigation logic (stack/tab structure)
├── screens/                              # Main UI screens (Login, Home, etc.)
├── translations/                         # Language JSON files for i18n (en, zh, ma, tl)
├── vm/                                   # Auzre VM deployment
│   └── video-translation/                # Video translation
│   └── yolo-inference/                   # Yolo pose recognition
│       └── deployment (Azure VM)/        # Package deployed in azure VM
│       └── model training/               # Model training files
│
├── .gitignore                            # Files and folders ignored in version control
├── App.js                                # Main app entry point
├── Demo Script.pdf                       # Live demo walkthrough document
├── README.md                             # Project documentation
├── app.json                              # Expo project configuration
├── babel.config.js                       # Babel settings
├── eas.json                              # Expo Application Services config
├── i18n.js                               # Language configuration
├── package.json                          # Project metadata and dependencies
├── web.config                            # Azure Static Web App configuration
```
## ⚙️ Installation & Setup

### 🔧 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js (v18+)**: [Download Node.js](https://nodejs.org/)
- **Python 3.10+**: [Download Python](https://www.python.org/)
- **Git**: [Download Node.js](https://git-scm.com/)
- **Expo CLI**:
  ```bash
  npm install -g expo-cli
  ```

### 🛠 Setup Instructions
1. Clone the repository:
    ```
    git clone https://github.com/your-username/SC2006-SignLanguageApp.git
    cd SC2006-SignBridge
    ```
2. Install dependencies:
    ```
    npm install
    ```
3. Run Expo Project Locally:

    - Mobile QR Code (With Expo Go app):
        ```
        npx expo start
        ```
    - Web Version:
        ```
        npx expo start --web
        ```

## 🧪 Testing
Refer to SC2006 Project Team 4 Test Cases.pdf for full test coverage.

### Test Types
- ✅ Black Box Testing – Based on user inputs & expected outputs

- 🔍 White Box Testing – Internal path coverage using basis path and cyclomatic complexity

## 🧠 System Design Artifacts
🧾 Software Requirements Specification (SRS)

📊 System Architecture Diagram

📝 Use Case Documentation

🎬 Demo Script

## 🚀 Azure Deployment
- **Frontend:** Azure Static Web Apps using GitHub Actions

- **Backend:** Deployed to Azure Virtual Machine with HTTPS Flask API and FastAPI

- **Data:** MongoDB (hosted on Atlas) and Azure Blob Storage for video data

- **Monitoring:** Azure Application Insights + Logging

## 🔄 CI/CD Pipeline (GitHub Actions)
- Automatically builds and deploys frontend via expo export

- Deploys to Azure Static Web App using secrets:

    - AZURE_STATIC_WEB_APPS_API_TOKEN

    - GITHUB_TOKEN

## 👨‍💻 Contributors
- Surya (Leader)
- Avanesh
- Aanya
- Wei Ming
- Yong Hao
- Yun Tat
