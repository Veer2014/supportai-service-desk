# 🛠️ SupportAI — AI-Powered Service Desk

SupportAI is a full-stack service desk application built for the DigiPlus Technical Assessment.

It helps support engineers create, manage, investigate and resolve technical incidents through a simple dashboard with AI-assisted incident analysis.

## 🎯 Problem

Support teams receive technical issues in natural language and need to quickly understand the issue, prioritize it, investigate possible causes and record the resolution.

The application provides a centralized system to manage this complete incident lifecycle.

## ✨ Features

- 📝 Create support incidents
- 📋 View existing incidents
- 🔍 View individual incident details
- 🔄 Manage incident lifecycle
- ⚡ Update incident priority
- 🤖 AI-assisted incident analysis
- 💡 Possible cause identification
- 🛠️ Recommended investigation actions
- 🎯 Suggested priority
- 📚 Historical help-desk ticket dataset integration
- ✅ Record incident resolution
- 💾 Persistent SQLite database
- ⚠️ Basic validation and error handling
- 📊 Support engineer dashboard

## 🏗️ Architecture

```text
React + Tailwind CSS
        │
        │ REST API
        ▼
FastAPI Backend
        │
   ┌────┴─────┐
   ▼          ▼
SQLite    AI Analysis
Database     Service
                │
                ▼
        Help Desk Dataset


🛠️ Tech Stack
Frontend
React
Vite
Tailwind CSS
JavaScript
Backend
Python
FastAPI
SQLAlchemy
Pydantic
Uvicorn
Database
SQLite
AI / Data
AI-assisted incident analysis
Hugging Face Help Desk Tickets dataset
🔄 Application Flow
A support engineer creates an incident.
The incident is stored in the SQLite database.
Existing incidents can be viewed from the dashboard.
An incident can be analyzed to obtain AI-assisted information.
The system provides:
Incident category
Possible cause
Recommended actions
Suggested priority
The support engineer investigates the issue.
The incident status and priority can be updated.
The final resolution can be recorded.
The incident remains persisted in the database.
📊 Dataset

The project uses the Help Desk Tickets dataset provided as part of the assessment.

The dataset is used as historical support-ticket context for the application.

Dataset source:

https://huggingface.co/datasets/mindweave/help-desk-tickets

.

🤖 AI Approach

The AI component is separated from the main application through a dedicated analysis service.

The incident title, description and priority are processed to produce structured support information such as possible causes, recommended actions and suggested priority.

The architecture keeps the AI layer separate from the incident management APIs so that the analysis implementation can be improved or replaced without changing the rest of the application.

⚠️ Known Limitations
The current application uses a lightweight AI analysis approach suitable for the assessment time constraint.
Authentication is not implemented.
The application is designed as a prototype rather than a production service desk.
Advanced semantic search and duplicate detection are not currently implemented.
🔮 Future Improvements
🔐 User authentication and role-based access
💬 Conversational support assistant
🔎 Semantic search using embeddings
🔁 Similar / duplicate incident detection
📈 Incident analytics
🔔 Notifications
🧠 Advanced RAG-based knowledge retrieval
🧪 Automated testing
🐳 Docker deployment
👨‍💻 Author
Veer Desai