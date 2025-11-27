# 🚀 Production Deployment Guide - QRLinkHub

This guide will help you deploy QRLinkHub to production with professional configurations.

---

## 📋 Pre-Deployment Checklist

### ✅ Code Quality
- [x] Professional UI/UX design implemented
- [x] Landing page created
- [x] Enhanced admin dashboard with statistics
- [x] Loading states and error handling added
- [x] Responsive design tested
- [x] Security features implemented

### ✅ Environment Configuration
- [ ] Production MongoDB URI configured
- [ ] Strong JWT secret generated
- [ ] CORS configured for production domain
- [ ] API URL updated for production

### ✅ Testing
- [ ] Registration flow tested
- [ ] Login flow tested
- [ ] Link creation tested
- [ ] QR code generation tested
- [ ] Admin panel tested
- [ ] Public profiles tested

---

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) - **RECOMMENDED**

#### Step 1: Deploy Backend to Render

1. **Create MongoDB Atlas Database**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/qrlinkhub`

2. **Deploy to Render**:
   - Sign up at [Render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     ```
     Name: qrlinkhub-api
     Region: Select closest to your users
     Branch: main (or master)
     Root Directory: backend
     Runtime: Node
     Build Command: npm install
     Start Command: node server.js
     ```

3. **Environment Variables** (on Render):
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/qrlinkhub
   JWT_SECRET=YOUR_SUPER_SECRET_KEY_HERE_MINIMUM_32_CHARACTERS
   PORT=5000
   CLIENT_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

4. **Get Backend URL**:
   - After deployment: `https://qrlinkhub-api.onrender.com`

#### Step 2: Deploy Frontend to Vercel

1. **Deploy to Vercel**:
   - Sign up at [Vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     ```
     Framework Preset: Vite
     Root Directory: frontend
     Build Command: npm run build
     Output Directory: dist
     Install Command: npm install
     ```

2. **Environment Variables** (on Vercel):
   ```env
   VITE_API_URL=https://qrlinkhub-api.onrender.com
   ```

3. **Deploy!**
   - Click "Deploy"
   - Your app will be live at: `https://your-app.vercel.app`

---

### Option 2: Full Stack on Render

1. **Deploy Backend** (same as above)

2. **Deploy Frontend as Static Site**:
   - Render.com → "New +" → "Static Site"
   - Configure:
     ```
     Build Command: npm run build
     Publish Directory: dist
     Root Directory: frontend
     ```
   - Add environment variable: `VITE_API_URL`

---

### Option 3: Railway.app (Both Services)

1. **Deploy Backend**:
   - Go to [Railway.app](https://railway.app)
   - "New Project" → "Deploy from GitHub"
   - Select repository
   - Add MongoDB plugin or use Atlas
   - Set environment variables
   - Configure start command: `cd backend && npm install && node server.js`

2. **Deploy Frontend**:
   - Add new service from same repo
   - Configure build: `cd frontend && npm install && npm run build`
   - Set static output directory: `frontend/dist`
   - Add `VITE_API_URL` variable

---

## 🔐 Security Checklist

### Update JWT Secret

```bash
# Generate a strong secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update in backend `.env` or hosting platform:
```env
JWT_SECRET=your_generated_secret_here
```

### CORS Configuration

Update `backend/server.js` if needed:
```javascript
app.use(cors({
    origin: ['https://your-domain.com', 'https://your-domain.vercel.app'],
    credentials: true
}));
```

### Environment Variables

**Backend (.env or hosting platform)**:
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=long_random_secret_key_here
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
```

**Frontend (.env or hosting platform)**:
```env
VITE_API_URL=https://your-backend-domain.com
```

---

## 📝 Post-Deployment Steps

### 1. Test All Features

✅ Registration:
- Go to `/register`
- Create test account
- Verify redirect to dashboard

✅ Login:
- Log out
- Log back in
- Verify authentication works

✅ Link Creation:
- Create a new link
- Verify QR code generates
- Test the short URL redirect

✅ Public Profile:
- Visit `/u/yourusername`
- Verify links display
- Test QR code scanning

### 2. Create Admin User

```bash
# Connect to production MongoDB
mongosh "your_mongodb_connection_string"

# Switch to database
use qrlinkhub

# Promote user to admin
db.users.updateOne(
  { email: "admin@yourdomain.com" },
  { $set: { role: "admin" } }
)

# Verify
db.users.find({ role: "admin" })
```

### 3. Monitor Application

- Check backend logs for errors
- Monitor MongoDB connection
- Test from different devices
- Verify CORS is working

---

## 🎨 Custom Domain (Optional)

### For Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `CLIENT_URL` in backend environment variables

### For Render:
1. Go to Service Settings → Custom Domain
2. Add your domain
3. Update DNS CNAME record
4. SSL certificates are auto-generated

---

## 📊 Performance Optimization

### Backend Optimizations:
- ✅ MongoDB indexes already set (email, username, slug, shortCode)
- ✅ JWT expiration set to 1 hour
- ✅ Efficient queries with Mongoose

### Frontend Optimizations:
- ✅ Vite for fast builds
- ✅ Code splitting enabled
- ✅ Lazy loading images
- ✅ Minified production build

---

## 🔍 Monitoring & Analytics

### Recommended Tools:
- **Backend**: Render logs, MongoDB Atlas monitoring
- **Frontend**: Vercel Analytics
- **Errors**: Sentry (optional)
- **Uptime**: UptimeRobot (free)

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"
**Solution**: 
- Verify backend is deployed and running
- Check CORS configuration
- Verify `VITE_API_URL` is correct

### Issue: "MongoDB connection failed"
**Solution**:
- Check MongoDB connection string
- Verify IP whitelist in Atlas (set to 0.0.0.0/0 for allow all)
- Test connection string locally first

### Issue: "JWT errors"
**Solution**:
- Verify `JWT_SECRET` is set in backend
- Clear browser local storage
- Check token expiration (1 hour default)

### Issue: "404 errors on refresh"
**Solution** (Vercel):
- Create `vercel.json` in frontend folder:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## ✅ Deployment Complete!

Your QRLinkHub application is now live and ready for users!

### Important URLs:
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://qrlinkhub-api.onrender.com
- **Admin Panel**: https://your-app.vercel.app/admin
- **Public Profiles**: https://your-app.vercel.app/u/username

### Next Steps:
1. Share your app with users
2. Create admin account
3. Monitor usage and performance
4. Gather feedback for improvements
5. Consider adding analytics

---

## 📞 Support

Need help? Check:
- GitHub repository issues
- Render/Vercel documentation
- MongoDB Atlas support
- Community forums

---

**🎉 Congratulations on deploying QRLinkHub to production!**
