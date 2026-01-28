# 💰 Expense Manager

A full-stack Progressive Web App (PWA) for tracking work hours, overtime, travel, and food expenses. Built with React + Flask, featuring Firebase Authentication and PostgreSQL database.

![PWA Installable](https://img.shields.io/badge/PWA-Installable-orange)
![React](https://img.shields.io/badge/React-19-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![Firebase](https://img.shields.io/badge/Firebase-Auth-yellow)

## ✨ Features

- 📊 **Dashboard** - View weekly summaries of hours and expenses
- ⏰ **Time Tracking** - Log work hours with overtime calculation
- 🚗 **Travel Expenses** - Track kilometers and travel costs
- 🍽️ **Food Expenses** - Record meal expenditures
- 📱 **PWA Support** - Install as native app on Android/iOS
- 🔐 **Firebase Auth** - Secure email/password and Google sign-in
- 📈 **Reports** - Generate weekly/monthly expense reports
- 🌙 **Dark Mode** - Beautiful dark theme UI

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Firebase SDK** - Authentication
- **vite-plugin-pwa** - PWA Support

### Backend
- **Flask 3.0** - Python Web Framework
- **Flask-SQLAlchemy** - ORM
- **Flask-Migrate** - Database Migrations
- **Firebase Admin SDK** - Token Verification
- **Gunicorn** - Production Server

### Database & Hosting
- **Neon PostgreSQL** - Serverless Postgres
- **Vercel** - Frontend Hosting
- **Render** - Backend Hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Firebase Project
- Neon Database Account

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables (see .env.example)
cp .env.example .env
# Edit .env with your credentials

# Run migrations
flask db upgrade

# Start development server
flask run
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Flask secret key (64-char hex) |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `FLASK_ENV` | `development` or `production` |
| `FRONTEND_URL` | Your Vercel frontend URL |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firebase service account JSON |

### Frontend (.env)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |

## 📦 Deployment

### Backend (Render)

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `pip install -r requirements.txt && flask db upgrade`
5. Set **Start Command**: `gunicorn run:app`
6. Add environment variables from `.env.example`

### Frontend (Vercel)

1. Import your GitHub repository on Vercel
2. Set **Root Directory** to `frontend`
3. Framework preset will auto-detect Vite
4. Add environment variables from `.env.example`

## 📱 PWA Installation

### Android
1. Open the app in Chrome
2. Tap the menu (⋮) → "Install app"
3. The app will be added to your home screen

### iOS
1. Open the app in Safari
2. Tap Share → "Add to Home Screen"
3. The app will be added to your home screen

### Desktop (Chrome/Edge)
1. Look for the install icon in the address bar
2. Click "Install"

## 📁 Project Structure

```
exm/
├── backend/
│   ├── app/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API endpoints
│   │   └── __init__.py   # Flask app factory
│   ├── migrations/       # Database migrations
│   ├── config.py         # Configuration
│   ├── requirements.txt  # Python dependencies
│   └── run.py           # Entry point
│
├── frontend/
│   ├── public/          # Static assets & PWA icons
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API & Firebase services
│   │   └── App.jsx      # Main app component
│   ├── index.html       # Entry HTML
│   ├── vite.config.js   # Vite + PWA config
│   └── package.json     # Node dependencies
│
└── README.md
```

## 🔒 Security Features

- CSRF protection with tokens
- HTTP-only session cookies
- Firebase token verification
- Rate limiting on authentication
- Account lockout after failed attempts
- CORS restricted to frontend domain
- SQL injection prevention via ORM

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ using React, Flask, and Firebase
