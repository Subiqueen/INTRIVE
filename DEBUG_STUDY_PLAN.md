# Study Plan Debugging Guide

## What I Fixed

### 1. Added Fallback Plan Generator
**Problem:** If AI fails, user gets error with no plan
**Solution:** Template-based plan generation for common skills

**Supported Skills:**
- Docker (3 tasks)
- AWS (3 tasks)
- TypeScript (3 tasks)
- React (3 tasks)
- Node.js (3 tasks)
- MongoDB (3 tasks)
- Git (2 tasks)

### 2. Better Error Handling
- Detailed console logging at each step
- Checks for resume analysis existence
- Validates missing skills array
- Graceful fallback when AI fails

### 3. Enhanced Frontend
- Progress bar showing completion percentage
- Task counter per day
- Visual indicators for completed days
- Better empty state with instructions
- Optimistic UI updates

### 4. Improved Task Management
- Safer task toggling with validation
- Null check for completedAt
- Error recovery with refresh

## How It Works

### Flow:
```
1. User clicks "Generate New Plan"
2. Backend checks resume analysis
3. Validates missing skills exist
4. Tries AI generation
5. If AI fails → Uses fallback templates
6. Converts days to dates
7. Saves to database
8. Returns plan to frontend
```

### Fallback System:
```
AI Available → Use AI-generated plan
AI Fails → Use template-based plan
No Templates → Generic learning tasks
```

## Testing Steps

### Step 1: Check Prerequisites
```bash
# Backend console should show:
Study plan generation started
User found: user@example.com
Missing skills: ['Docker', 'AWS', 'TypeScript']
Target role: Full Stack Developer
```

### Step 2: Generate Plan
1. Go to Study Plan page
2. Click "Generate New Plan"
3. Watch backend console

**Expected Output:**
```
Attempting AI plan generation...
[Either]
AI plan generated successfully
[Or]
AI generation failed: [error]
Falling back to template-based generation
Using fallback plan generator
```

### Step 3: Verify Plan
- Should see 30 daily plans
- Each day has 2-3 tasks
- Progress bar shows 0%
- Tasks have checkboxes

### Step 4: Test Task Completion
1. Click checkbox on any task
2. Should see:
   - Checkbox checked
   - Text strike-through
   - Progress bar updates

## Common Errors & Solutions

### Error 1: "No skill gaps identified"
**Cause:** Resume not analyzed or no missing skills
**Solution:**
1. Go to Resume page
2. Upload resume
3. Analyze for target role
4. Come back to Study Plan

### Error 2: "Failed to generate study plan"
**Cause:** Multiple possible issues
**Check Backend Console:**
```
Study plan generation started ← Should see this
User found: email ← Should see this
Missing skills: [...] ← Should have items
```

**If missing skills is empty:**
- Resume analysis didn't identify gaps
- Try different target role
- Ensure resume has technical content

### Error 3: Empty Plan Display
**Cause:** Plan exists but dailyPlans is empty
**Check:**
```javascript
// Browser console
console.log(plan);
// Should have: { _id, userId, targetRole, dailyPlans: [...] }
```

### Error 4: Task Won't Toggle
**Cause:** Wrong plan ID or indices
**Check Network Tab:**
- URL: /api/study-plan/task/:planId/:dayIndex/:taskIndex
- Status: Should be 200
- Response: Updated plan

### Error 5: AI Generation Fails
**This is OK!** System automatically falls back to templates.

**To Enable AI:**
1. Check .env: `LLM_API_KEY=your_key`
2. Verify API key is valid
3. Check API quota

**Without AI:**
- Still get 30-day plan
- Template-based tasks
- All features work

## Backend Console Logs

### Successful Generation:
```
Study plan generation started
User found: user@example.com
Missing skills: ['Docker', 'AWS']
Target role: Full Stack Developer
Attempting AI plan generation...
[AI success or fallback message]
Converting days to dates...
Creating study plan document...
Study plan saved successfully
```

### With Fallback:
```
Study plan generation started
User found: user@example.com
Missing skills: ['Docker', 'AWS']
Target role: Full Stack Developer
Attempting AI plan generation...
AI generation failed: Invalid API key
Falling back to template-based generation
Using fallback plan generator
Converting days to dates...
Creating study plan document...
Study plan saved successfully
```

## Browser Console Logs

### Successful:
```
Generating study plan...
Plan generated: {_id: "...", dailyPlans: [...]}
```

### Error:
```
Generating study plan...
Generation failed: Error: ...
```

## What to Check

### 1. Resume Analysis Exists
```bash
# MongoDB
db.users.findOne({ email: "your@email.com" })
# Should have: resumeAnalysis.missingSkills: [...]
```

### 2. Missing Skills Not Empty
```javascript
// Backend console
Missing skills: ['Docker', 'AWS', 'TypeScript']
// Should have at least 1 skill
```

### 3. Plan Structure
```javascript
{
  _id: "...",
  userId: "...",
  targetRole: "Full Stack Developer",
  dailyPlans: [
    {
      date: "2026-02-19",
      tasks: [
        {
          topic: "Docker Basics",
          description: "...",
          estimatedTime: 60,
          resources: ["..."],
          completed: false
        }
      ]
    }
  ],
  createdAt: "2026-02-19"
}
```

## Quick Fixes

### Fix 1: No Missing Skills
```bash
# Manually add missing skills (for testing)
# MongoDB
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { 
    "resumeAnalysis.missingSkills": ["Docker", "AWS", "TypeScript"],
    "resumeAnalysis.targetRole": "Full Stack Developer"
  }}
)
```

### Fix 2: Clear Old Plans
```bash
# Delete all study plans for user
db.studyplans.deleteMany({ userId: ObjectId("your_user_id") })
```

### Fix 3: Restart Backend
```bash
cd backend
npm run dev
```

## Expected Behavior

### With AI:
- 30 days of customized tasks
- Specific to your missing skills
- Detailed descriptions
- Curated resources

### With Fallback:
- 30 days of template tasks
- Based on skill templates
- Generic but useful
- Standard learning resources

### Both Provide:
- ✓ 30-day plan
- ✓ 2-3 tasks per day
- ✓ Time estimates
- ✓ Learning resources
- ✓ Progress tracking
- ✓ Task completion

## Testing Checklist

- [ ] Resume uploaded and analyzed
- [ ] Missing skills identified
- [ ] Backend running on port 5000
- [ ] User logged in
- [ ] Click "Generate New Plan"
- [ ] Check backend console for logs
- [ ] Plan appears on frontend
- [ ] Progress bar shows 0%
- [ ] Can check/uncheck tasks
- [ ] Progress updates correctly

## Still Not Working?

### Collect Information:
1. Backend console output (full log)
2. Browser console errors
3. Network tab response
4. User's resume analysis data

### Check:
- Is user authenticated?
- Does resume analysis exist?
- Are missing skills populated?
- Is MongoDB connected?
- Are all dependencies installed?

### Manual Test:
```bash
# Test with curl
curl -X POST http://localhost:5000/api/study-plan/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Success Indicators

1. ✓ Backend logs show "Study plan saved successfully"
2. ✓ Frontend displays 30 daily plans
3. ✓ Progress bar appears
4. ✓ Tasks are checkable
5. ✓ No errors in console
6. ✓ Plan persists on page refresh
