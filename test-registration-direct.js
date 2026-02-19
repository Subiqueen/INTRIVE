// Direct test of registration endpoint
// Run with: node test-registration-direct.js

import axios from 'axios';

const testRegistration = async () => {
  console.log('=== Testing Registration Endpoint ===\n');

  // Test 1: Check backend health
  try {
    console.log('1. Checking backend health...');
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✓ Backend is running:', health.data);
  } catch (error) {
    console.error('✗ Backend is not running!');
    console.error('Please start backend with: cd backend && npm run dev');
    return;
  }

  // Test 2: Try registration with unique email
  try {
    console.log('\n2. Testing registration...');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'test123456'
    };
    
    console.log('Sending:', testUser);
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testUser);
    
    console.log('✓ Registration successful!');
    console.log('Response:', {
      token: response.data.token.substring(0, 20) + '...',
      user: response.data.user
    });
    
  } catch (error) {
    console.error('\n✗ Registration failed!');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
      
      if (error.response.status === 400) {
        console.error('\n400 Error Reasons:');
        console.error('- User already exists with this email');
        console.error('- Missing required fields');
        console.error('- Validation failed');
      }
    } else if (error.request) {
      console.error('No response from server');
      console.error('Is backend running on port 5000?');
    } else {
      console.error('Error:', error.message);
    }
  }

  // Test 3: Try with existing email (should fail with 400)
  try {
    console.log('\n3. Testing duplicate email (should fail)...');
    const duplicateUser = {
      name: 'Another User',
      email: 'test@example.com', // Common test email
      password: 'test123456'
    };
    
    await axios.post('http://localhost:5000/api/auth/register', duplicateUser);
    console.log('✗ Should have failed but succeeded');
    
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✓ Correctly rejected duplicate email');
      console.log('Message:', error.response.data.message);
    } else {
      console.log('Unexpected error:', error.message);
    }
  }

  // Test 4: Try with missing fields (should fail with 400)
  try {
    console.log('\n4. Testing missing fields (should fail)...');
    const incompleteUser = {
      name: 'Test',
      // missing email and password
    };
    
    await axios.post('http://localhost:5000/api/auth/register', incompleteUser);
    console.log('✗ Should have failed but succeeded');
    
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✓ Correctly rejected incomplete data');
      console.log('Message:', error.response.data.message);
    } else {
      console.log('Unexpected error:', error.message);
    }
  }

  console.log('\n=== Test Complete ===');
};

testRegistration();
