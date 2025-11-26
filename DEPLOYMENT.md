# 🌍 Deployment Guide for QRLinkHub

To publish your application online, you need to host three parts:
1.  **Database** (MongoDB)
2.  **Backend** (Node.js API)
3.  **Frontend** (React App)

Here are the two best ways to do it.

---

## Option 1: The "Easy & Free" Way (PaaS)
*Best for beginners. Uses free tiers of popular services.*

### Step 1: Database (MongoDB Atlas)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2.  Create a new **Cluster** (Free Tier).
3.  In "Database Access", create a database user (save the username/password).
4.  In "Network Access", allow access from anywhere (`0.0.0.0/0`).
5.  Get your **Connection String** (looks like `mongodb+srv://<user>:<password>@cluster...`).

### Step 2: Backend (Render.com or Railway.app)
1.  Push your code to **GitHub**.
2.  Sign up for [Render](https://render.com/).
3.  Create a new **Web Service**.
4.  Connect your GitHub repo.
5.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
6.  **Environment Variables**:
    *   `MONGO_URI`: (Paste your Atlas connection string)
    *   `JWT_SECRET`: (Create a strong secret password)
    *   `PORT`: `5000` (or let Render assign one)
    *   `CLIENT_URL`: (The URL of your deployed Frontend, e.g., `https://qrlinkhub.vercel.app`)

### Step 3: Frontend (Vercel or Netlify)
1.  Sign up for [Vercel](https://vercel.com/).
2.  Import your GitHub repo.
3.  **Settings**:
    *   **Root Directory**: `frontend`
    *   **Framework Preset**: Vite
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  **Environment Variables**:
    *   `VITE_API_URL`: (The URL of your deployed Backend from Step 2, e.g., `https://qrlinkhub-api.onrender.com`)

---

## Option 2: The "Pro" Way (VPS + Docker)
*Best for full control. Costs ~$5/month.*

1.  **Get a VPS** (DigitalOcean Droplet, AWS EC2, or Hetzner).
2.  **Install Docker & Docker Compose** on the server.
3.  **Copy your project** to the server (git clone).
4.  **Update `docker-compose.yml`** to expose ports or use a reverse proxy (Nginx/Traefik) to handle SSL (HTTPS).
5.  Run `docker-compose up -d --build`.

---

## ⚠️ Important Code Changes Required Before Deploying

Currently, your frontend code points to `http://localhost:5000`. You must change this to use an Environment Variable so it points to your live backend when deployed.

### 1. Create `frontend/.env`
```env
VITE_API_URL=http://localhost:5000
```

### 2. Update Frontend API Calls
Replace all instances of `http://localhost:5000` with `import.meta.env.VITE_API_URL`.

**Example:**
```javascript
// Before
axios.get('http://localhost:5000/api/links')

// After
const API_URL = import.meta.env.VITE_API_URL;
axios.get(`${API_URL}/api/links`)
```
