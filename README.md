# 🛠 AI-Powered Pump Maintenance System for Industrial Pumps

An AI-powered predictive maintenance system that monitors pump data and predicts potential failures before they occur, helping reduce downtime, maintenance costs, and unexpected breakdowns.

---

## 📌 Project Overview

This project uses Machine Learning and a FastAPI backend to analyze pump data such as temperature, pressure, vibration, and flow rate.  
Based on historical data, the trained model predicts whether a pump is likely to fail or operate normally.

The system simulates real-time pump monitoring and displays predictions on an interactive frontend dashboard.

---

## 🚀 Key Features

- 📊 Pump sensor data analysis  
- 🤖 Machine Learning failure prediction  
- 🔧 Maintenance tracking system  
- 🔐 Secure authentication (JWT-based)  
- 📈 Interactive admin dashboard  

---

## 🏗 Tech Stack

**Frontend**
- React + TypeScript  
- Tailwind CSS  
- Vite  

**Backend**
- FastAPI  
- SQLAlchemy  

**Database**
- SQLite / PostgreSQL  

**Machine Learning**
- Scikit-learn  

---

## 📂 Project Structure

```
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
```

---

## ⚙️ How to Run

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
