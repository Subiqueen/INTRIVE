// Test script for study plan generation
// Run with: node test-study-plan.js

import axios from 'axios';

const testStudyPlan = async () => {
  try {
    console.log('=== Study Plan Generation Test ===\n');

    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'test123456'
    });
    const token = loginResponse.data.token;
    console.log('✓ Login successful\n');

    // Step 2: Check user's resume analysis
    console.log('2. Checking resume analysis...');
    try {
      const resumeAnalysis = await axios.get('http://localhost:5000/api/resume/analysis', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (resumeAnalysis.data.missingSkills && resumeAnalysis.data.missingSkills.length > 0) {
        console.log('✓ Missing skills found:', resumeAnalysis.data.missingSkills);
      } else {
        console.log('⚠ No missing skills found. Uploading test resume...');
        // You would need to upload a resume here
        console.log('Please upload a resume through the UI first.\n');
        return;
      }
    } catch (error) {
      console.log('⚠ No resume analysis found. Please upload resume first.\n');
      return;
    }

    // Step 3: Generate study plan
    console.log('\n3. Generating study plan...');
    const planResponse = await axios.post(
      'http://localhost:5000/api/study-plan/generate',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('✓ Study plan generated!\n');
    console.log('Plan Details:');
    console.log('- Target Role:', planResponse.data.targetRole);
    console.log('- Total Days:', planResponse.data.dailyPlans.length);
    console.log('- Total Tasks:', planResponse.data.dailyPlans.reduce((sum, day) => sum + day.tasks.length, 0));
    
    console.log('\nFirst Day Tasks:');
    planResponse.data.dailyPlans[0].tasks.forEach((task, i) => {
      console.log(`  ${i + 1}. ${task.topic} (${task.estimatedTime} min)`);
    });

    // Step 4: Test task completion
    console.log('\n4. Testing task completion...');
    const planId = planResponse.data._id;
    await axios.patch(
      `http://localhost:5000/api/study-plan/task/${planId}/0/0`,
      { completed: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✓ Task marked as completed\n');

    // Step 5: Fetch plan to verify
    console.log('5. Verifying plan...');
    const fetchResponse = await axios.get('http://localhost:5000/api/study-plan', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const firstTask = fetchResponse.data.dailyPlans[0].tasks[0];
    if (firstTask.completed) {
      console.log('✓ Task completion verified\n');
    } else {
      console.log('✗ Task completion failed\n');
    }

    console.log('✓ All tests passed!');

  } catch (error) {
    console.error('\n✗ Test failed!');
    if (error.response) {
      console.error('Server error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Cannot connect to server. Is backend running on port 5000?');
    } else {
      console.error('Error:', error.message);
    }
  }
};

testStudyPlan();
