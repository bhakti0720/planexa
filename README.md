
<div align="center">

# 🛰️ Planexa - AI Mission Planner

### *Intelligent Satellite Mission Planning with Google Gemini 2.5 Flash*

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.5-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-purple?logo=google)](https://deepmind.google/technologies/gemini/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)](https://vitejs.dev/)

[Live Demo](#) · [Documentation](#) · [Report Bug](#)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Deployment](#-deployment)
- [Team](#-team)
- [License](#-license)

---

## 🌟 Overview

**Planexa** is an AI-powered satellite mission planning platform that transforms natural language descriptions into comprehensive mission concepts. Using Google's Gemini 2.5 Flash model and advanced LLM orchestration, it generates detailed orbit designs, constellation sizing, coverage analysis, and risk assessments in seconds.

### 🎯 What We Solve

Traditional satellite mission planning is:
- ❌ Time-consuming (weeks of analysis)
- ❌ Expensive (requires specialized consultants)
- ❌ Complex (multiple specialized tools needed)
- ❌ Inaccessible (steep learning curve)

### ✅ Planexa Makes It

- ✅ **Instant** - Generate missions in <3 seconds
- ✅ **Intelligent** - AI orchestration with multiple specialized agents
- ✅ **Comprehensive** - From orbit design to risk analysis
- ✅ **Beautiful** - ChatGPT-style interface with dark space theme

---

## 🚀 Key Features

### 💬 ChatGPT-Style Interface
- Multi-chat support (create, switch, delete conversations)
- Beautiful dark space theme with gradient backgrounds
- Real-time streaming responses
- Persistent localStorage (never lose your missions)

### 🤖 Advanced LLM Orchestration
- **Google Gemini 2.5 Flash** - Latest multimodal AI model
- **Multi-Agent System** - Data orchestrator + LLM orchestrator
- **Specialized Estimators** - Launch, timeline, cost calculations
- Natural language input processing
- Intelligent fallback mechanisms

### 📊 Comprehensive Mission Design
- **Orbit Design** - Altitude, inclination, eccentricity calculations
- **Constellation Sizing** - Optimal satellite count determination
- **Coverage Analysis** - Visual coverage maps with CSS-only animation
- **Data Volume Estimates** - Daily/yearly data projections
- **Risk Assessment** - Technical, financial, and timeline risks with mitigation
- **Cost Estimation** - Launch costs, timeline predictions

### 🎨 Beautiful UI/UX
- **Responsive Design** - Works on desktop, tablet, mobile
- **Smooth Animations** - Fade-ins, bouncing dots, pulsing coverage points
- **Lucide Icons** - Modern icon set
- **3 Quick Demo Scenarios** - Agriculture, Broadband, Disaster Response

### 📤 Export & Share
- Export missions to JSON
- Share via URL (planned)
- Print-ready formatting (planned)

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.13.2-5A29E4?style=for-the-badge)

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.5-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-0.34.0-499848?style=for-the-badge)

### AI & APIs
![Gemini](https://img.shields.io/badge/Gemini_2.5-Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)

</div>

---

## 📁 Project Structure

```plaintext
planexa/
│
├── mission-copilot-frontend/          # React Frontend Application
│   ├── public/
│   │   └── vite.svg                   # Vite logo
│   │
│   ├── src/
│   │   ├── assets/                    # Static assets
│   │   │
│   │   ├── components/                # React Components
│   │   │   ├── Chat.jsx              # Main chat interface
│   │   │   ├── ChatMessage.jsx       # Individual message component
│   │   │   ├── common/               # Reusable components
│   │   │   │   └── (shared UI components)
│   │   │   ├── Landing.jsx           # Landing page
│   │   │   ├── ChatHistory.jsx       # Chat history sidebar
│   │   │   ├── ConfirmationModal.jsx # Delete confirmation modal
│   │   │   └── MessageInput.jsx      # Message input component
│   │   │
│   │   ├── hooks/                     # Custom React hooks
│   │   │   └── index.js
│   │   │
│   │   ├── pages/                     # Page components
│   │   │   └── index.js
│   │   │
│   │   ├── services/                  # API services
│   │   │   └── api.js                # Axios API integration
│   │   │
│   │   ├── App.jsx                    # Root component
│   │   ├── App.css                    # Global styles
│   │   ├── index.css                  # Tailwind imports
│   │   └── main.jsx                   # React entry point
│   │
│   ├── .env                           # Environment variables
│   ├── .gitignore
│   ├── eslint.config.js               # ESLint configuration
│   ├── index.html                     # HTML entry point
│   ├── package.json                   # Dependencies
│   ├── package-lock.json
│   ├── postcss.config.js              # PostCSS configuration
│   ├── README.md                      # Frontend documentation
│   ├── tailwind.config.js             # Tailwind configuration
│   └── vite.config.js                 # Vite configuration
│
├── mission-copilot-backend/           # FastAPI Backend Application
│   ├── app/
│   │   ├── __init__.py               # App initialization
│   │   ├── config.py                 # Configuration management
│   │   ├── dependencies.py           # FastAPI dependencies
│   │   │
│   │   ├── core/                      # Core business logic
│   │   │   ├── __init__.py
│   │   │   ├── config.py             # Core configuration
│   │   │   ├── data_orchestrator.py  # Data orchestration layer
│   │   │   └── llm_orchestrator.py   # LLM orchestration logic
│   │   │
│   │   ├── estimators/                # Mission estimators
│   │   │   ├── __init__.py
│   │   │   ├── cost_estimator.py     # Cost calculation engine
│   │   │   ├── launch_estimator.py   # Launch requirements
│   │   │   └── timeline_estimator.py # Timeline predictions
│   │   │
│   │   └── routers/                   # API route handlers
│   │       ├── __init__.py
│   │       ├── chat.py               # Chat endpoints
│   │       └── main.py               # Main router
│   │
│   ├── tests/                         # Test suite
│   │   ├── __init__.py
│   │   ├── test_core/                # Core tests
│   │   │   └── __init__.py
│   │   ├── test_estimators/          # Estimator tests
│   │   │   └── __init__.py
│   │   └── test_routers/             # Router tests
│   │       └── __init__.py
│   │
│   ├── .env                           # Environment variables
│   ├── .gitignore
│   ├── main.py                        # FastAPI entry point
│   ├── pytest.ini                     # Pytest configuration
│   └── requirements.txt               # Python dependencies
│
├── .gitignore                         # Global ignore rules
├── README.md                          # This file
└── LICENSE                            # MIT License
```

---

## 🏁 Getting Started

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18.0+ | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.0+ | Included with Node.js |
| **Python** | 3.11+ | [python.org](https://www.python.org/) |
| **pip** | 23.0+ | Included with Python |

**Verify installations:**
```bash
node --version    # v18.0.0+
npm --version     # 9.0.0+
python --version  # Python 3.11+
pip --version     # 23.0+
```

---

### Installation

#### **1️⃣ Clone Repository**

```bash
git clone https://github.com/YOUR_USERNAME/planexa.git
cd planexa
```

---

#### **2️⃣ Frontend Setup**

```bash
# Navigate to frontend
cd mission-copilot-frontend

# Install dependencies
npm install

# Expected packages:
# ✅ react@19.2.0
# ✅ vite@7.2.4
# ✅ tailwindcss@3.4.19
# ✅ axios@1.13.2
# ✅ lucide-react@0.562.0
# ✅ react-router-dom@7.12.0
```

**Create `.env` file** in `mission-copilot-frontend/`:

```bash
VITE_API_URL=http://localhost:8000
```

---

#### **3️⃣ Backend Setup**

```bash
# Navigate to backend (from project root)
cd mission-copilot-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Expected packages:
# ✅ fastapi==0.115.5
# ✅ uvicorn==0.34.0
# ✅ google-generativeai==0.8.3
# ✅ requests==2.32.3
# ✅ pytest (for testing)
```

---

#### **4️⃣ Get Gemini API Key**

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy your key (starts with `AIza...`)

**Create `.env` file** in `mission-copilot-backend/`:

```bash
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

⚠️ **Never commit `.env` to Git!**

---

## 🎮 Usage

### **Start Development Servers**

#### **Terminal 1: Backend Server**

```bash
cd mission-copilot-backend
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

✅ **Backend running at:** `http://localhost:8000`
📖 **API docs:** `http://localhost:8000/docs`

---

#### **Terminal 2: Frontend Server**

```bash
cd mission-copilot-frontend
npm run dev
```

**Expected output:**
```
  VITE v7.2.4  ready in 542 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ **Frontend running at:** `http://localhost:5173`

---

### **Try These Demo Scenarios**

1. **Agriculture Monitoring**
   ```
   Design a 3U CubeSat for agricultural monitoring in South India with daily revisit
   ```

2. **Broadband Internet**
   ```
   Plan a satellite constellation for European broadband internet coverage
   ```

3. **Disaster Response**
   ```
   Create a polar orbit constellation for disaster response monitoring
   ```

---

## 📡 API Documentation

### **Backend Endpoints**

#### **1. POST /api/chat**

Generate comprehensive satellite mission from natural language input.

**Request:**
```json
{
  "message": "Design a satellite to monitor agriculture in South India daily"
}
```

**Response:**
```json
{
  "mission_name": "AgriSat-1",
  "orbit_design": {
    "altitude_km": 550,
    "inclination_deg": 97.4,
    "eccentricity": 0.001,
    "period_minutes": 95.8
  },
  "constellation": {
    "number_of_satellites": 3,
    "orbit_planes": 1,
    "satellites_per_plane": 3
  },
  "coverage_analysis": {
    "daily_revisit_time": "2-3 times",
    "ground_track_repeat": "16 days",
    "swath_width_km": 185
  },
  "data_volume": {
    "daily_gb": 120,
    "yearly_tb": 43.8
  },
  "cost_estimation": {
    "launch_cost_usd": 15000000,
    "satellite_cost_usd": 5000000,
    "total_mission_cost_usd": 20000000
  },
  "timeline": {
    "development_months": 18,
    "launch_readiness_date": "2027-07-15"
  },
  "risk_assessment": {
    "technical_risk": "Low",
    "financial_risk": "Medium",
    "timeline_risk": "Low",
    "mitigation_strategies": [
      "Use proven CubeSat platform",
      "Secure launch rideshare early",
      "Implement redundant systems"
    ]
  }
}
```

---

#### **2. GET /api/health**

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-13T21:36:00Z",
  "version": "1.0.0"
}
```

---

## 🏗️ Architecture

### **System Design**

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                             │
│                  http://localhost:5173                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP Requests (Axios)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               REACT FRONTEND (Vite)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Components Layer                                    │  │
│  │  ├── Chat.jsx (ChatGPT-style interface)            │  │
│  │  ├── ChatMessage.jsx (Message rendering)           │  │
│  │  ├── Landing.jsx (Entry point)                     │  │
│  │  ├── ChatHistory.jsx (Conversation sidebar)        │  │
│  │  └── MessageInput.jsx (User input)                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services Layer                                      │  │
│  │  └── api.js (Axios integration)                     │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ POST /api/chat
                       ▼
┌─────────────────────────────────────────────────────────────┐
│            FASTAPI BACKEND (Uvicorn)                        │
│                  http://localhost:8000                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routers Layer                                       │  │
│  │  ├── chat.py (Chat endpoint handler)               │  │
│  │  └── main.py (Main router aggregation)             │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                      │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Core Orchestration Layer                           │  │
│  │  ├── llm_orchestrator.py (Gemini 2.5 Flash)       │  │
│  │  └── data_orchestrator.py (Data aggregation)      │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                      │
│                       ▼                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Estimators Layer                                    │  │
│  │  ├── launch_estimator.py (Launch calculations)     │  │
│  │  ├── timeline_estimator.py (Timeline predictions)  │  │
│  │  └── cost_estimator.py (Cost analysis)            │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ External API Calls
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Google Gemini 2.5 Flash API                        │  │
│  │  - Natural language processing                      │  │
│  │  - Mission concept generation                       │  │
│  │  - Technical analysis                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### **Data Flow**

1. **User Input** → MessageInput.jsx
2. **Frontend API Call** → services/api.js (Axios POST)
3. **Backend Router** → routers/chat.py
4. **LLM Orchestration** → core/llm_orchestrator.py (Gemini 2.5 Flash)
5. **Data Orchestration** → core/data_orchestrator.py
6. **Specialized Estimations** → estimators/ (launch, timeline, cost)
7. **Response Generation** → JSON response
8. **Frontend Rendering** → ChatMessage.jsx
9. **Persistence** → LocalStorage

---

## 🚢 Deployment

### **Frontend Deployment (Vercel)**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd mission-copilot-frontend

# Deploy
vercel

# Production deployment
vercel --prod
```

**Production URL:** `https://planexa.vercel.app`

---

### **Backend Deployment (Render)**

1. Go to [Render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `planexa-backend`
   - **Root Directory:** `mission-copilot-backend`
   - **Runtime:** Python 3.11
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Your Gemini API key
6. Click **"Create Web Service"**

**Production URL:** `https://planexa-backend.onrender.com`

---

### **Update Frontend API URL**

Edit `mission-copilot-frontend/.env`:

```bash
# Change from:
VITE_API_URL=http://localhost:8000

# To:
VITE_API_URL=https://planexa-backend.onrender.com
```

Redeploy frontend:
```bash
vercel --prod
```

---

## 🧪 Testing

### **Run Backend Tests**

```bash
cd mission-copilot-backend
pytest tests/

# Run specific test file
pytest tests/test_core/

# Run with coverage
pytest --cov=app tests/
```

---

## 🤝 Contributing

We welcome contributions! Follow these steps:

### **1. Fork & Clone**

```bash
git clone https://github.com/YOUR_USERNAME/planexa.git
cd planexa
```

### **2. Create Branch**

```bash
git checkout -b feature/amazing-feature
```

### **3. Make Changes**

- Follow existing code style
- Add tests for new features
- Update documentation

### **4. Commit**

```bash
git add .
git commit -m "feat: Add amazing feature

- Detailed description
- What changed
- Why it's better"
```

### **5. Push & PR**

```bash
git push origin feature/amazing-feature
```

Then create Pull Request on GitHub!

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Planexa Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

- **Google Gemini Team** - For Gemini 2.5 Flash API
- **FastAPI** - Modern Python web framework
- **React & Vite** - Lightning-fast frontend development
- **Lucide** - Beautiful icon library
- **Tailwind CSS** - Utility-first CSS framework

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **AI Model** | Gemini 2.5 Flash |
| **React Version** | 19.2.0 |
| **Python Version** | 3.11+ |
| **Response Time** | <3 seconds |
| **Frontend Components** | 10+ React components |
| **Backend Modules** | 3 core + 3 estimators |
| **API Endpoints** | 2 REST endpoints |
| **Test Coverage** | Coming soon |
| **Development Time** | 2 weeks |

---

## 🐛 Troubleshooting

### **Backend won't start**
```bash
# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check .env file exists
ls .env
```

### **Frontend build errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### **API connection errors**
```bash
# Check .env file in frontend
cat .env  # Should have VITE_API_URL

# Verify backend is running
curl http://localhost:8000/api/health
```

---

<div align="center">

## ⭐ Star Us on GitHub!

**Made with ❤️ for space mission planning**

[🚀 Live Demo](#) · [📖 Documentation](#) · [🐛 Report Bug](#)

---

**© 2026 Planexa. All rights reserved.**

