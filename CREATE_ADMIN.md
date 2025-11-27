# Create Admin User Script

This script helps you create an admin user for QRLinkHub.

## Method 1: Using MongoDB Shell (Recommended)

```bash
# Connect to MongoDB
docker exec -it qrlinkhub-mongo mongosh

# Switch to database
use qrlinkhub

# Promote existing user to admin by email
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)

# Or promote by username
db.users.updateOne(
  { username: "yourusername" },
  { $set: { role: "admin" } }
)

# Verify the update
db.users.find({ role: "admin" })

# Exit
exit
```

## Method 2: Using PowerShell (Windows)

```powershell
# Quick command to promote user to admin
docker exec -it qrlinkhub-mongo mongosh --eval "use qrlinkhub; db.users.updateOne({email: 'your@email.com'}, {\$set: {role: 'admin'}})"
```

## Method 3: Create Admin During Registration

1. Register a new account normally at http://localhost:5173/register
2. Use the commands above to promote that user to admin
3. Log out and log back in
4. You'll now have access to the Admin Panel at `/admin`

## Quick Setup Steps

1. **Start the application** (if not already running):
   ```powershell
   docker-compose up -d
   cd backend; npm run dev
   cd frontend; npm run dev
   ```

2. **Register a new user**:
   - Go to http://localhost:5173/register
   - Create account with email: admin@qrlinkhub.com
   - Password: Admin@123

3. **Promote to admin**:
   ```powershell
   docker exec -it qrlinkhub-mongo mongosh --eval "use qrlinkhub; db.users.updateOne({email: 'admin@qrlinkhub.com'}, {\$set: {role: 'admin'}})"
   ```

4. **Test admin access**:
   - Log out and log back in
   - You should be redirected to /admin automatically
   - Or manually visit http://localhost:5173/admin

## Verifying Admin Access

After promoting a user to admin:

1. **Check the database**:
   ```bash
   docker exec -it qrlinkhub-mongo mongosh
   use qrlinkhub
   db.users.find({ role: "admin" }).pretty()
   ```

2. **Test in application**:
   - Login with the admin account
   - You should be automatically redirected to the Admin Dashboard
   - The Admin Dashboard should show:
     - Total users count
     - Total links created
     - Number of admins
     - Average links per user
     - Full user table with statistics

## Troubleshooting

**Issue: Can't access admin panel**
- Make sure the user's role is set to "admin" in the database
- Clear browser cache and local storage
- Log out and log back in

**Issue: MongoDB connection error**
- Ensure MongoDB container is running: `docker ps`
- Restart MongoDB: `docker-compose restart`

**Issue: Command not found**
- Make sure you're in the project directory
- Ensure Docker is running

## Admin Panel Features

Once you have admin access, you can:
- ✅ View all registered users
- ✅ See total platform statistics
- ✅ Monitor link creation across users
- ✅ View user registration dates
- ✅ Track admin accounts
- ✅ See average engagement metrics

## Security Note

⚠️ In production:
- Use strong passwords for admin accounts
- Change default JWT secret in .env
- Restrict admin creation
- Enable 2FA if possible
- Use environment-specific credentials
