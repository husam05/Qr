# QRLinkHub 🔗

A full-stack QR Code Link Management System with user authentication, link tracking, and admin dashboard.

## ✨ Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend**: React, Vite, Vanilla CSS (Premium Design)
- **QR Generation**: qrcode npm package

## 📋 Prerequisites
- Node.js (v20.18+) - **Already included in `nodejs/` folder**
- MongoDB (running on port 27017)
- Docker (optional, for easy MongoDB setup)

## 🚀 Quick Start

### Option 1: Using Docker for MongoDB (Recommended)
```bash
# Install Docker if not installed
sudo apt install docker.io
sudo systemctl start docker

# Start MongoDB
docker-compose up -d

# The backend is already running!
# Start frontend in a new terminal:
export PATH=/home/jet/Desktop/qr-system/nodejs/bin:$PATH
cd frontend
npm run dev
```

### Option 2: Install MongoDB Manually
```bash
# Install MongoDB
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Backend is already running!
# Start frontend:
export PATH=/home/jet/Desktop/qr-system/nodejs/bin:$PATH
cd frontend
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## 🎯 Features

### User Features
- ✅ **Register/Login** with JWT authentication
- ✅ **Personal Dashboard** to manage links
- ✅ **Create Links** with auto-generated QR codes
- ✅ **Edit/Delete Links** with real-time updates
- ✅ **Public Profile Page** at `/u/{username}`
- ✅ **Profile QR Code** for easy sharing
- ✅ **Click Tracking** for each link

### Admin Features
- ✅ **Admin Panel** at `/admin`
- ✅ **View All Users** and their statistics
- ✅ **Link Count** per user
- ✅ **User Management** overview

### Technical Features
- ✅ **JWT Authentication** with secure token storage
- ✅ **QR Code Generation** (Base64 encoded)
- ✅ **Short URL Redirect** with click counting
- ✅ **RESTful API** architecture
- ✅ **Premium UI** with gradient accents and animations

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Links
- `GET /api/links` - Get all user links (requires auth)
- `POST /api/links` - Create new link (requires auth)
- `PUT /api/links/:id` - Update link (requires auth)
- `DELETE /api/links/:id` - Delete link (requires auth)

### Public
- `GET /u/:slug` - Get public profile and links
- `GET /l/:shortCode` - Redirect to target URL (increments clicks)

### Admin
- `GET /api/admin/users` - Get all users with stats (admin only)

## 👤 Creating an Admin User

### Method 1: Via MongoDB Shell
```bash
# Connect to MongoDB
mongosh

# Switch to database
use qrlinkhub

# Update user role
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 2: Via MongoDB Compass
1. Connect to `mongodb://localhost:27017`
2. Open `qrlinkhub` database
3. Open `users` collection
4. Find your user and edit the `role` field to `"admin"`

## 🎨 Design Features
- **Dark Mode** premium aesthetic
- **Gradient Accents** (Indigo to Purple)
- **Smooth Animations** and transitions
- **Glassmorphism** card effects
- **Responsive Layout** for all devices
- **Modern Typography** with Inter font

## 📁 Project Structure
```
qr-system/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app component
│   │   └── index.css    # Global styles
│   └── package.json
├── nodejs/              # Local Node.js installation
└── docker-compose.yml   # MongoDB container config
```

## 🔧 Environment Variables

Backend `.env`:
```
MONGO_URI=mongodb://localhost:27017/qrlinkhub
JWT_SECRET=supersecretkey
PORT=5000
```

## 🐛 Troubleshooting

**MongoDB Connection Error?**
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Or start with Docker: `docker-compose up -d`

**Frontend not loading?**
- Check if running on port 5173
- Ensure all dependencies installed: `npm install`

**Backend errors?**
- Check MongoDB connection
- Verify `.env` file exists with correct values

## 📝 License
MIT License - Feel free to use this project!
