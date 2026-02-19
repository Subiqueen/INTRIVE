// Quick test script to verify backend registration
// Run with: node test-registration.js

import axios from 'axios';

const testRegistration = async () => {
  try {
    console.log('Testing backend registration endpoint...\n');
    
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✓ Health check passed:', health.data);
    
    // Test 2: Registration
    console.log('\n2. Testing registration...');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'test123456'
    };
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testUser);
    console.log('✓ Registration successful!');
    console.log('Token:', response.data.token.substring(0, 20) + '...');
    console.log('User:', response.data.user);
    
    console.log('\n✓ All tests passed! Backend is working correctly.');
    
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

testRegistration();
