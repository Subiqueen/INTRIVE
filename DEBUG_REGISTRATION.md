# Registration Error Debugging Guide

## Common Issues & Solutions

### 1. MongoDB Connection Error
**Error:** "MongoDB connection error" or "ECONNREFUSED"
**Solution:**
- Ensure MongoDB is running: `mongod` or start MongoDB service
- Check MONGODB_URI in .env file
- Default: `mongodb://localhost:27017/placement-prep`

### 2. Missing .env File
**Error:** "JWT_SECRET is not defined" or undefined errors
**Solution:**
```bash
cd backend
cp .env.example .env
# Edit .env and add your values
```

### 3. CORS Error
**Error:** "Access-Control-Allow-Origin" blocked
**Solution:** Already configured in server.js with `app.use(cors())`

### 4. Port Already in Use
**Error:** "EADDRINUSE: address already in use :::5000"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env
```

### 5. Dependencies Not Installed
**Error:** "Cannot find module 'express'" or similar
**Solution:**
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 6. Route Not Found (404)
**Error:** "Cannot POST /api/auth/register"
**Solution:** Check if backend server is running on port 5000

### 7. Network Error
**Error:** "Network Error" in browser console
**Solution:** 
- Backend not running
- Wrong proxy configuration
- Check Vite proxy in vite.config.js

## Step-by-Step Debugging

### Step 1: Check Backend Server
```bash
cd backend
npm run dev
```
Expected output:
```
Server running on port 5000
MongoDB connected
```

### Step 2: Test Backend Directly
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test registration (PowerShell)
Invoke-RestMethod -Uri http://localhost:5000/api/auth/register -Method POST -Body (@{name="Test";email="test@test.com";password="test123"} | ConvertTo-Json) -ContentType "application/json"
```

### Step 3: Check Frontend
```bash
cd frontend
npm run dev
```
Expected: Server running on http://localhost:3000

### Step 4: Browser Console
Open DevTools (F12) → Console tab
Look for errors when clicking Register button

### Step 5: Network Tab
DevTools → Network tab → Click Register
Check:
- Request URL: http://localhost:3000/api/auth/register
- Status Code: Should be 201 (success) or 400/500 (error)
- Response: Check error message

## Quick Fix Script

Run this to check everything:
```bash
# Check if MongoDB is running
mongosh --eval "db.version()"

# Check if ports are available
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Restart everything
cd backend
npm run dev

# In new terminal
cd frontend
npm run dev
```

## What Error Are You Seeing?

Please provide:
1. Error message from browser console
2. Error message from backend terminal
3. Network tab response (if any)
