// Test script for resume analysis
// Run with: node test-resume-analysis.js

import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

const testResumeAnalysis = async () => {
  try {
    console.log('=== Resume Analysis Test ===\n');

    // Step 1: Login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'test123456'
    });
    const token = loginResponse.data.token;
    console.log('✓ Login successful\n');

    // Step 2: Create a test resume file
    console.log('2. Creating test resume...');
    const testResumeContent = `
John Doe
Full Stack Developer

SKILLS:
- JavaScript, TypeScript, React, Node.js
- MongoDB, Express, HTML, CSS
- Git, Docker, AWS
- REST API, GraphQL

EXPERIENCE:
Software Developer at Tech Company
- Built web applications using React and Node.js
- Implemented RESTful APIs with Express
- Deployed applications on AWS
- Used Docker for containerization

EDUCATION:
Bachelor of Computer Science
    `;
    
    fs.writeFileSync('test-resume.txt', testResumeContent);
    console.log('✓ Test resume created\n');

    // Step 3: Upload resume
    console.log('3. Uploading resume for analysis...');
    const formData = new FormData();
    formData.append('resume', fs.createReadStream('test-resume.txt'));
    formData.append('targetRole', 'Full Stack Developer');

    const uploadResponse = await axios.post(
      'http://localhost:5000/api/resume/upload',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✓ Analysis complete!\n');
    console.log('Results:');
    console.log('- Skills Found:', uploadResponse.data.skills);
    console.log('- Missing Skills:', uploadResponse.data.missingSkills);
    console.log('- Recommendations:', uploadResponse.data.recommendations);

    // Cleanup
    fs.unlinkSync('test-resume.txt');
    console.log('\n✓ All tests passed!');

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

testResumeAnalysis();
