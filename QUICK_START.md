# 🚀 Quick Reference Guide

## Current Status
✅ Backend: Running on port 5000
✅ Frontend: Running on port 5173
✅ MongoDB: Running on port 27017

## Start MongoDB (Choose One)

### Docker (Easiest)
```bash
sudo apt install docker.io
sudo systemctl start docker
cd /home/jet/Desktop/qr-system
docker-compose up -d
```

### System Install
```bash
sudo apt install mongodb
sudo systemctl start mongod
```

## Access URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api
- Public Profile: http://localhost:5173/u/{username}
- Admin Panel: http://localhost:5173/admin

## Test the App

1. **Register**: http://localhost:5173/register
   - Create account with username, email, password
   
2. **Dashboard**: Automatically redirected
   - Create links
   - View profile QR
   - Manage links

3. **Create Admin**:
   ```bash
   mongosh
   use qrlinkhub
   db.users.updateOne({email: "your@email.com"}, {$set: {role: "admin"}})
   ```

## Common Commands

### Restart Backend
```bash
export PATH=/home/jet/Desktop/qr-system/nodejs/bin:$PATH
cd /home/jet/Desktop/qr-system/backend
npm run dev
```

### Restart Frontend
```bash
export PATH=/home/jet/Desktop/qr-system/nodejs/bin:$PATH
cd /home/jet/Desktop/qr-system/frontend
npm run dev
```

### Check MongoDB
```bash
sudo systemctl status mongod
# or
docker ps | grep mongo
```

## API Testing (curl)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Create Link (replace TOKEN)
```bash
curl -X POST http://localhost:5000/api/links \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{"label":"My Website","url":"https://example.com"}'
```

## File Locations
- Backend: `/home/jet/Desktop/qr-system/backend/`
- Frontend: `/home/jet/Desktop/qr-system/frontend/`
- Config: `/home/jet/Desktop/qr-system/backend/.env`
- Node.js: `/home/jet/Desktop/qr-system/nodejs/`

## Troubleshooting

**Can't connect to backend?**
- Check if MongoDB is running
- Check backend terminal for errors

**Frontend shows blank page?**
- Check browser console (F12)
- Verify frontend is running on port 5173

**JWT errors?**
- Token might be expired (1 hour)
- Log out and log back in

**MongoDB connection refused?**
- Start MongoDB: `sudo systemctl start mongod`
- Or: `docker-compose up -d`

## Environment Variables
Located in `/home/jet/Desktop/qr-system/backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/qrlinkhub
JWT_SECRET=supersecretkey
PORT=5000
```

## Port Usage
- 5000: Backend API
- 5173: Frontend (Vite dev server)
- 27017: MongoDB

## Next Steps
1. Start MongoDB
2. Visit http://localhost:5173
3. Register an account
4. Create some links
5. Share your profile QR!

---
**Need help?** Check README.md or PROJECT_SUMMARY.md for detailed documentation.
