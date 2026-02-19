# Analytics Debugging Guide

## Overview
This guide helps debug the analytics system that displays interview performance trends and dashboard statistics.

## Common Issues and Solutions

### Issue 1: Analytics Page Shows "No Data"

**Symptoms:**
- Analytics page loads but shows "No interview data yet"
- Charts are empty

**Causes:**
1. No completed interviews in database
2. Interviews missing `overallScore` field
3. User not authenticated properly

**Solutions:**

1. **Complete an interview first:**
   - Go to Interview page
   - Complete at least one interview (HR, Technical, or DSA)
   - Return to Analytics page

2. **Check if interviews exist:**
   ```bash
   # Run the test script
   node test-analytics.js
   ```

3. **Verify authentication:**
   - Check browser console for token errors
   - Try logging out and logging back in

### Issue 2: Analytics API Returns 401 Unauthorized

**Symptoms:**
- Console shows "Request failed with status code 401"
- Analytics page shows error message

**Causes:**
- Token expired or missing
- Token not being sent in request headers

**Solutions:**

1. **Check token in localStorage:**
   - Open browser DevTools (F12)
   - Go to Application > Local Storage
   - Verify `token` exists

2. **Re-login:**
   - Logout and login again
   - Token will be refreshed

### Issue 3: Analytics API Returns 500 Server Error

**Symptoms:**
- Console shows "Request failed with status code 500"
- Backend logs show database errors

**Causes:**
- MongoDB connection issue
- Missing or corrupted data
- Backend route error

**Solutions:**

1. **Check backend logs:**
   ```bash
   # Backend should show detailed error logs
   # Look for "Dashboard error:" or "Performance trend error:"
   ```

2. **Verify MongoDB connection:**
   - Check if MongoDB is running
   - Verify connection string in `.env`

3. **Check data integrity:**
   ```bash
   # Run test script to see detailed error
   node test-analytics.js
   ```

### Issue 4: Charts Not Rendering

**Symptoms:**
- Data loads but charts don't display
- Console shows Chart.js errors

**Causes:**
- Chart.js not installed
- Missing Chart.js components registration

**Solutions:**

1. **Install Chart.js dependencies:**
   ```bash
   cd frontend
   npm install chart.js react-chartjs-2
   ```

2. **Verify imports in Analytics.jsx:**
   - Check that all Chart.js components are imported
   - Verify ChartJS.register() is called

### Issue 5: Scores Show as 0 or NaN

**Symptoms:**
- Analytics loads but all scores are 0
- Dashboard shows NaN%

**Causes:**
- Interviews completed but scores not calculated
- `overallScore` field missing in Interview model

**Solutions:**

1. **Backend now calculates scores automatically:**
   - The updated analytics routes calculate scores from questions
   - Even if `overallScore` is missing, it will compute from `questions` array

2. **Complete new interviews:**
   - New interviews will have proper scores
   - Old interviews will have scores calculated on-the-fly

## Testing Steps

### 1. Test Backend Endpoints

```bash
# Run the analytics test script
node test-analytics.js
```

Expected output:
```
=== ANALYTICS TEST SCRIPT ===

Step 1: Logging in...
✓ Login successful

Step 2: Fetching performance trend...
✓ Performance Trend Data:
  Total interviews: 3
  1. HR - Score: 75.0% - Date: 2/19/2026
  2. Technical - Score: 82.5% - Date: 2/19/2026
  3. DSA - Score: 68.0% - Date: 2/19/2026

Step 3: Fetching dashboard data...
✓ Dashboard Data:
  Total Interviews: 3
  HR Score: 75.0%
  Technical Score: 82.5%
  DSA Score: 68.0%
  Study Progress: 45.5%
  Completed Tasks: 10/22

=== ALL TESTS PASSED ===
```

### 2. Test Frontend

1. **Open browser DevTools (F12)**
2. **Go to Console tab**
3. **Navigate to Analytics page**
4. **Check for logs:**
   - "Fetching analytics with token: Token exists"
   - "Trend data: [...]"
   - "Dashboard data: {...}"

### 3. Verify Data Flow

1. **Complete an interview:**
   - Go to `/interview`
   - Select interview type
   - Answer all questions
   - Submit interview

2. **Check Analytics immediately:**
   - Go to `/analytics`
   - Should see new interview in trend
   - Dashboard stats should update

## Enhanced Features

The updated analytics system now includes:

### Frontend Improvements:
- ✅ Loading state with spinner
- ✅ Error handling with retry button
- ✅ Dashboard stats cards (Total Interviews, Study Progress, HR Score, Technical Score)
- ✅ Performance trend line chart
- ✅ Interview type comparison bar chart
- ✅ Recent interviews grid
- ✅ Detailed console logging for debugging

### Backend Improvements:
- ✅ Automatic score calculation from questions if `overallScore` is missing
- ✅ Detailed console logging
- ✅ Better error handling
- ✅ Fallback score calculation
- ✅ Study plan progress calculation

## API Endpoints

### GET /api/analytics/dashboard
Returns comprehensive dashboard statistics.

**Response:**
```json
{
  "hrScore": 75.5,
  "technicalScore": 82.3,
  "dsaScore": 68.0,
  "studyProgress": 45.5,
  "totalInterviews": 3,
  "completedTasks": 10,
  "totalTasks": 22
}
```

### GET /api/analytics/performance-trend
Returns time-series interview performance data.

**Response:**
```json
[
  {
    "date": "2026-02-19T10:30:00.000Z",
    "score": 75.5,
    "type": "HR"
  },
  {
    "date": "2026-02-19T14:20:00.000Z",
    "score": 82.3,
    "type": "Technical"
  }
]
```

## Quick Checklist

Before reporting an issue, verify:

- [ ] Backend server is running (`npm start` in backend folder)
- [ ] Frontend dev server is running (`npm run dev` in frontend folder)
- [ ] MongoDB is connected (check backend console)
- [ ] User is logged in (check localStorage for token)
- [ ] At least one interview is completed
- [ ] Browser console shows no errors
- [ ] Chart.js dependencies are installed

## Still Having Issues?

1. **Check backend console** for detailed error logs
2. **Check browser console** for frontend errors
3. **Run test script** to isolate the problem: `node test-analytics.js`
4. **Clear browser cache** and localStorage
5. **Restart both servers** (backend and frontend)

## File Locations

- Frontend: `frontend/src/pages/Analytics.jsx`
- Backend Routes: `backend/routes/analytics.js`
- Backend Model: `backend/models/Analytics.js`
- Interview Model: `backend/models/Interview.js`
- Test Script: `test-analytics.js`
