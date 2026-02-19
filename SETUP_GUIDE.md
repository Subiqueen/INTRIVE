# Complete Setup Guide - Placement Prep Platform

## Prerequisites Check

### 1. Install Node.js
```bash
node --version  # Should be v18 or higher
npm --version
```

### 2. Install MongoDB
**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Or use MongoDB Compass

**Verify MongoDB:**
```bash
mongosh
# Should connect successfully
```

## Installation Steps

### Step 1: Install All Dependencies
```bash
# From project root
npm run install-all
```

Or manually:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment
```bash
cd backend
# .env file already created with default values
# Edit if needed (MongoDB URI, JWT secret, etc.)
```

### Step 3: Start MongoDB
```bash
# Windows - Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod
```

### Step 4: Start Backend Server
```bash
# From backend directory
cd backend
npm run dev
```

**Expected Output:**
```
[nodemon] starting `node server.js`
Server running on port 5000
MongoDB connected
```

### Step 5: Start Frontend (New Terminal)
```bash
# From frontend directory
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Step 6: Access Application
Open browser: http://localhost:3000

## Testing Registration

1. Click "Register" link
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
3. Click "Register" button
4. Should redirect to Dashboard

## Troubleshooting

### Backend Not Starting?
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F
```

### MongoDB Not Connecting?
```bash
# Check MongoDB status
mongosh

# If fails, start MongoDB
net start MongoDB
```

### Frontend Not Loading?
```bash
# Clear node_modules and reinstall
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

### CORS Errors?
- Ensure backend is running on port 5000
- Check vite.config.js proxy settings
- Backend already has CORS enabled

## Project Structure
```
placement-prep-platform/
├── backend/
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── middleware/      # Auth middleware
│   ├── .env            # Environment variables
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Route pages
│   │   └── App.jsx     # Main app
│   └── vite.config.js  # Vite configuration
└── package.json        # Root scripts
```

## API Endpoints

- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- POST /api/resume/upload - Upload resume
- POST /api/study-plan/generate - Generate study plan
- POST /api/interview/start - Start interview
- GET /api/analytics/dashboard - Get analytics

## Default Credentials (After Registration)
Use any email/password you register with.

## Need Help?
Check DEBUG_REGISTRATION.md for detailed error solutions.
