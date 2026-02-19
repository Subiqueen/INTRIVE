/**
 * Analytics Testing Script
 * Tests the analytics endpoints and displays results
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testAnalytics() {
  console.log('=== ANALYTICS TEST SCRIPT ===\n');

  try {
    // Step 1: Login to get token
    console.log('Step 1: Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✓ Login successful\n');

    // Step 2: Test performance trend endpoint
    console.log('Step 2: Fetching performance trend...');
    const trendResponse = await axios.get(`${BASE_URL}/api/analytics/performance-trend`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✓ Performance Trend Data:');
    console.log(`  Total interviews: ${trendResponse.data.length}`);
    if (trendResponse.data.length > 0) {
      trendResponse.data.forEach((item, i) => {
        console.log(`  ${i + 1}. ${item.type} - Score: ${item.score?.toFixed(1) || 'N/A'}% - Date: ${new Date(item.date).toLocaleDateString()}`);
      });
    } else {
      console.log('  No interview data found');
    }
    console.log('');

    // Step 3: Test dashboard endpoint
    console.log('Step 3: Fetching dashboard data...');
    const dashboardResponse = await axios.get(`${BASE_URL}/api/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✓ Dashboard Data:');
    console.log(`  Total Interviews: ${dashboardResponse.data.totalInterviews}`);
    console.log(`  HR Score: ${dashboardResponse.data.hrScore.toFixed(1)}%`);
    console.log(`  Technical Score: ${dashboardResponse.data.technicalScore.toFixed(1)}%`);
    console.log(`  DSA Score: ${dashboardResponse.data.dsaScore.toFixed(1)}%`);
    console.log(`  Study Progress: ${dashboardResponse.data.studyProgress.toFixed(1)}%`);
    console.log(`  Completed Tasks: ${dashboardResponse.data.completedTasks}/${dashboardResponse.data.totalTasks}`);
    console.log('');

    console.log('=== ALL TESTS PASSED ===');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure backend server is running on port 5000');
    console.log('2. Check if you have a test user (email: test@example.com, password: password123)');
    console.log('3. Verify MongoDB is connected');
    console.log('4. Check if you have completed any interviews');
  }
}

testAnalytics();
