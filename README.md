🤖 AI-Powered Pump Maintenance System

The AI-Powered Pump Maintenance System is a full-stack industrial application designed to monitor pump health, manage maintenance operations, and predict potential failures using Machine Learning.

It combines real-time maintenance tracking with AI-based risk prediction to support smarter, more efficient maintenance decisions.

🚀 Key Features
🔐 Secure Authentication

JWT-based login system

Role-based access (Admin / Technician)

📊 Pump Management Dashboard

View all pumps and their current status

Track pumps under maintenance

Monitor last maintenance dates

🔧 Maintenance Module

Dedicated maintenance section

“Mark as Maintained” functionality

Automatically removes serviced pumps from the maintenance list

🤖 AI Failure Prediction

Machine Learning model to predict pump risk level

Identifies high-risk pumps before failure

Supports predictive maintenance planning

🏗 Tech Stack

Frontend

React + TypeScript

Tailwind CSS

Vite

Backend

FastAPI

SQLAlchemy ORM

RESTful API architecture

Database

SQLite / PostgreSQL

Machine Learning

Scikit-learn

Integrated prediction API endpoint

📂 Project Structure
AI-Powered-Pump-Maintenance-System
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── database.py
│   │   └── ...
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── ...
│   └── package.json
│
└── README.md
⚙️ Getting Started
Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
Frontend
cd frontend
npm install
npm run dev
