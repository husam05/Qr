# 🚀 Deployment Guide: QRLinkHub

This guide will help you deploy your full-stack application to the web for free.

## 🏗️ Architecture
- **Frontend:** Vercel (Free, fast, great for React)
- **Backend:** Render (Free tier, supports Node.js)
- **Database:** MongoDB Atlas (Free tier cloud database)

---

## 1️⃣ Step 1: Set up the Database (MongoDB Atlas)
Since your local database is in Docker, we need a cloud database for the live site.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up.
2. Create a **New Cluster** (select the free "Shared" tier).
3. **Create a Database User:**
   - Go to "Database Access" -> "Add New Database User".
   - Username: `admin` (or your choice).
   - Password: `your_secure_password`.
   - Role: "Read and write to any database".
4. **Allow Network Access:**
   - Go to "Network Access" -> "Add IP Address".
   - Select **"Allow Access from Anywhere"** (`0.0.0.0/0`).
   - Click "Confirm".
5. **Get Connection String:**
   - Go to "Database" -> Click "Connect" on your cluster.
   - Select "Drivers" (Node.js).
   - Copy the connection string. It looks like:
     `mongodb+srv://admin:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
   - **Replace `<password>`** with the password you created in step 3.
   - **Save this URL**, you will need it for the Backend.

---

## 2️⃣ Step 2: Deploy Backend (Render)
1. Push your latest code to GitHub (you already did this!).
2. Go to [Render.com](https://render.com/) and sign up/login.
3. Click **"New +"** -> **"Web Service"**.
4. Connect your GitHub repository (`husam05/Qr`).
5. **Configure the Service:**
   - **Name:** `qrlinkhub-api` (or similar)
   - **Root Directory:** `backend` (⚠️ Important!)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free
6. **Environment Variables (Advanced):**
   - Scroll down to "Environment Variables" -> "Add Environment Variable".
   - Add the following:
     - `MONGO_URI`: Paste your MongoDB connection string from Step 1.
     - `JWT_SECRET`: Enter a long random string (e.g., `mysecretkey123`).
     - `CLIENT_URL`: `*` (We will update this later to your frontend URL).
7. Click **"Create Web Service"**.
8. Wait for the deployment to finish. You will get a URL like `https://qrlinkhub-api.onrender.com`.
   - **Copy this URL**, you will need it for the Frontend.

---

## 3️⃣ Step 3: Deploy Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com/) and sign up/login.
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository (`husam05/Qr`).
4. **Configure the Project:**
   - **Framework Preset:** Vite (should be auto-detected).
   - **Root Directory:** Click "Edit" and select `frontend`. (⚠️ Important!)
5. **Environment Variables:**
   - Click "Environment Variables".
   - Add:
     - **Key:** `VITE_API_URL`
     - **Value:** Your Backend URL from Step 2 (e.g., `https://qrlinkhub-api.onrender.com`). 
     - ⚠️ **Note:** Do NOT add a trailing slash `/` at the end.
6. Click **"Deploy"**.
7. Wait for the build to complete. You will get a domain like `https://qr-system.vercel.app`.

---

## 4️⃣ Step 4: Final Connection
Now that you have your Frontend URL (e.g., `https://qr-system.vercel.app`), let's secure the backend.

1. Go back to **Render Dashboard** -> Your Web Service -> **Environment**.
2. Edit the `CLIENT_URL` variable.
3. Change it from `*` to your actual frontend URL: `https://qr-system.vercel.app`.
4. Save changes. Render will restart the server.

---

## 🎉 Done!
Your app is now live!
- **Frontend:** `https://qr-system.vercel.app`
- **Backend:** `https://qrlinkhub-api.onrender.com`
