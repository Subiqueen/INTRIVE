# Fix Registration 400 Error

## What 400 Error Means

HTTP 400 = Bad Request
The server understood the request but rejected it due to:
1. User already exists with that email
2. Missing or invalid data
3. Validation failure

## Step-by-Step Debugging

### Step 1: Check Backend Console

When you try to register, backend should show:
```
Registration request received: { body: { name: '...', email: '...', password: '...' } }
```

**If you DON'T see this:**
- Backend is not running
- Request not reaching backend
- CORS issue

**If you see this but get 400:**
- Check the next log line for the specific error

### Step 2: Check Browser Console

Open DevTools (F12) → Console tab

You should see:
```
Attempting registration... {name: "...", email: "...", passwordLength: 6}
Registration error: AxiosError: Request failed with status code 400
Error response: {message: "..."}
Error status: 400
Server error message: ...
```

**The "Server error message" tells you exactly what's wrong!**

### Step 3: Common 400 Errors

#### Error 1: "User already exists with this email"
**Cause:** Email is already registered

**Solutions:**
1. Use a different email
2. Login instead of registering
3. Delete the user from MongoDB:
```bash
mongosh
use placement-prep
db.users.deleteOne({ email: "your@email.com" })
```

#### Error 2: "All fields are required"
**Cause:** Name, email, or password is empty

**Solutions:**
1. Fill in all fields
2. Check for extra spaces
3. Ensure form is submitting correctly

#### Error 3: "Name must be at least 2 characters"
**Cause:** Name is too short

**Solution:** Enter a name with 2+ characters

#### Error 4: "Password must be at least 6 characters"
**Cause:** Password is too short

**Solution:** Enter a password with 6+ characters

### Step 4: Check Network Tab

DevTools (F12) → Network tab → Try to register

Click on the "register" request:

**Headers tab:**
- Request URL: http://localhost:3000/api/auth/register
- Request Method: POST
- Status Code: 400

**Payload tab:**
- Should show: `{name: "...", email: "...", password: "..."}`

**Response tab:**
- Should show: `{message: "..."}`
- This is the exact error!

### Step 5: Test Backend Directly

Run the test script:
```bash
node test-registration-direct.js
```

This will:
1. Check if backend is running
2. Try registration with unique email
3. Try duplicate email (should fail)
4. Try missing fields (should fail)

**Expected output:**
```
✓ Backend is running
✓ Registration successful!
✓ Correctly rejected duplicate email
✓ Correctly rejected incomplete data
```

## Quick Fixes

### Fix 1: Use Different Email
```javascript
// Instead of: test@example.com
// Use: yourname123@example.com
```

### Fix 2: Clear Existing Users (Development Only)
```bash
mongosh
use placement-prep
db.users.deleteMany({})  # Deletes all users
```

### Fix 3: Check Backend is Running
```bash
# Terminal 1
cd backend
npm run dev

# Should see:
# Server running on port 5000
# MongoDB connected
```

### Fix 4: Check MongoDB is Running
```bash
# Windows
net start MongoDB

# Or check if running:
mongosh
# Should connect without error
```

### Fix 5: Restart Everything
```bash
# Stop all terminals (Ctrl+C)

# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Try registration again
```

## Detailed Debugging Steps

### 1. Check What Data is Being Sent

Add this to Register.jsx before axios.post:
```javascript
console.log('Sending to server:', { 
  name: name.trim(), 
  email: email.trim().toLowerCase(), 
  password: '***' + password.length + ' chars***'
});
```

### 2. Check Backend Receives Data

Backend should log:
```
Registration request received: { body: { name: '...', email: '...', password: '...' } }
```

### 3. Check Validation

Backend will log one of:
```
User created successfully: [user_id]
// OR
[Error message explaining why it failed]
```

### 4. Check Response

Frontend should log:
```
Registration successful: {token: "...", user: {...}}
// OR
Server error message: [specific error]
```

## Most Common Cause

**90% of the time, it's:**
"User already exists with this email"

**Solution:**
Use a different email address!

## Testing Checklist

- [ ] Backend running on port 5000
- [ ] MongoDB connected
- [ ] Backend logs show "Registration request received"
- [ ] All form fields filled in
- [ ] Name is 2+ characters
- [ ] Email is valid format
- [ ] Password is 6+ characters
- [ ] Email is NOT already registered
- [ ] Browser console shows the error message
- [ ] Network tab shows the request

## Still Getting 400?

### Collect This Information:

1. **Backend Console Output:**
```
Registration request received: { body: {...} }
[Next line shows the error]
```

2. **Browser Console Output:**
```
Server error message: [exact message]
```

3. **Network Tab Response:**
```
{message: "[exact error]"}
```

4. **What You're Trying:**
- Name: ?
- Email: ?
- Password length: ?

### Then Check:

1. Is the email already used?
```bash
mongosh
use placement-prep
db.users.findOne({ email: "your@email.com" })
```

2. Are all fields filled?
3. Is backend receiving the request?
4. Is MongoDB connected?

## Example Working Registration

**Input:**
- Name: John Doe
- Email: john.doe123@example.com
- Password: password123

**Backend Console:**
```
Registration request received: { body: { name: 'John Doe', email: 'john.doe123@example.com', password: '...' } }
User created successfully: 507f1f77bcf86cd799439011
```

**Browser Console:**
```
Attempting registration... {name: "John Doe", email: "john.doe123@example.com", passwordLength: 11}
Registration successful: {token: "eyJhbGc...", user: {...}}
```

**Result:** Redirected to dashboard

## Prevention

To avoid this error:
1. Use unique emails for testing
2. Clear test data regularly
3. Check backend logs before debugging frontend
4. Use the test script to verify backend works
