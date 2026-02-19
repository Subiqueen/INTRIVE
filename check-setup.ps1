# PowerShell script to check if everything is set up correctly
Write-Host "=== Placement Prep Platform - Setup Checker ===" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "1. Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js not found! Please install Node.js" -ForegroundColor Red
}

# Check npm
Write-Host "2. Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "   ✓ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ npm not found!" -ForegroundColor Red
}

# Check MongoDB
Write-Host "3. Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoCheck = mongosh --eval "db.version()" --quiet 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "   ✗ MongoDB not running. Start with: net start MongoDB" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ MongoDB not installed or not running" -ForegroundColor Red
}

# Check backend dependencies
Write-Host "4. Checking backend dependencies..." -ForegroundColor Yellow
if (Test-Path "backend/node_modules") {
    Write-Host "   ✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ✗ Backend dependencies missing. Run: cd backend && npm install" -ForegroundColor Red
}

# Check frontend dependencies
Write-Host "5. Checking frontend dependencies..." -ForegroundColor Yellow
if (Test-Path "frontend/node_modules") {
    Write-Host "   ✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ✗ Frontend dependencies missing. Run: cd frontend && npm install" -ForegroundColor Red
}

# Check .env file
Write-Host "6. Checking .env file..." -ForegroundColor Yellow
if (Test-Path "backend/.env") {
    Write-Host "   ✓ .env file exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ .env file missing. Created from .env.example" -ForegroundColor Yellow
    Copy-Item "backend/.env.example" "backend/.env"
}

# Check if ports are available
Write-Host "7. Checking ports..." -ForegroundColor Yellow
$port5000 = netstat -ano | Select-String ":5000"
$port3000 = netstat -ano | Select-String ":3000"

if ($port5000) {
    Write-Host "   ⚠ Port 5000 is in use (Backend port)" -ForegroundColor Yellow
} else {
    Write-Host "   ✓ Port 5000 is available" -ForegroundColor Green
}

if ($port3000) {
    Write-Host "   ⚠ Port 3000 is in use (Frontend port)" -ForegroundColor Yellow
} else {
    Write-Host "   ✓ Port 3000 is available" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Setup Check Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start backend:  cd backend && npm run dev" -ForegroundColor White
Write-Host "2. Start frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "3. Open browser:   http://localhost:3000" -ForegroundColor White
