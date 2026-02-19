/**
 * Analytics Setup Verification Script
 * Checks if all required components are properly configured
 */

import fs from 'fs';
import path from 'path';

console.log('=== ANALYTICS SETUP VERIFICATION ===\n');

let allChecksPass = true;

// Check 1: Frontend Analytics component exists
console.log('Check 1: Frontend Analytics component...');
if (fs.existsSync('frontend/src/pages/Analytics.jsx')) {
  console.log('✓ Analytics.jsx exists');
} else {
  console.log('✗ Analytics.jsx NOT FOUND');
  allChecksPass = false;
}

// Check 2: Backend analytics routes exist
console.log('\nCheck 2: Backend analytics routes...');
if (fs.existsSync('backend/routes/analytics.js')) {
  console.log('✓ analytics.js routes exist');
} else {
  console.log('✗ analytics.js routes NOT FOUND');
  allChecksPass = false;
}

// Check 3: Analytics model exists
console.log('\nCheck 3: Analytics model...');
if (fs.existsSync('backend/models/Analytics.js')) {
  console.log('✓ Analytics.js model exists');
} else {
  console.log('✗ Analytics.js model NOT FOUND');
  allChecksPass = false;
}

// Check 4: Interview model exists
console.log('\nCheck 4: Interview model...');
if (fs.existsSync('backend/models/Interview.js')) {
  console.log('✓ Interview.js model exists');
} else {
  console.log('✗ Interview.js model NOT FOUND');
  allChecksPass = false;
}

// Check 5: Chart.js dependencies in package.json
console.log('\nCheck 5: Chart.js dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
  const hasChartJs = packageJson.dependencies['chart.js'];
  const hasReactChartJs = packageJson.dependencies['react-chartjs-2'];
  
  if (hasChartJs && hasReactChartJs) {
    console.log('✓ Chart.js dependencies found');
    console.log(`  - chart.js: ${hasChartJs}`);
    console.log(`  - react-chartjs-2: ${hasReactChartJs}`);
  } else {
    console.log('✗ Chart.js dependencies MISSING');
    if (!hasChartJs) console.log('  Missing: chart.js');
    if (!hasReactChartJs) console.log('  Missing: react-chartjs-2');
    allChecksPass = false;
  }
} catch (error) {
  console.log('✗ Could not read frontend/package.json');
  allChecksPass = false;
}

// Check 6: Analytics route registered in server.js
console.log('\nCheck 6: Analytics routes registered in server.js...');
try {
  const serverJs = fs.readFileSync('backend/server.js', 'utf8');
  const hasImport = serverJs.includes("import analyticsRoutes from './routes/analytics.js'");
  const hasRoute = serverJs.includes("app.use('/api/analytics', analyticsRoutes)");
  
  if (hasImport && hasRoute) {
    console.log('✓ Analytics routes properly registered');
  } else {
    console.log('✗ Analytics routes NOT properly registered');
    if (!hasImport) console.log('  Missing import statement');
    if (!hasRoute) console.log('  Missing app.use() statement');
    allChecksPass = false;
  }
} catch (error) {
  console.log('✗ Could not read backend/server.js');
  allChecksPass = false;
}

// Check 7: Analytics route in App.jsx
console.log('\nCheck 7: Analytics route in App.jsx...');
try {
  const appJsx = fs.readFileSync('frontend/src/App.jsx', 'utf8');
  const hasImport = appJsx.includes("import Analytics from './pages/Analytics'");
  const hasRoute = appJsx.includes('<Route path="/analytics"');
  
  if (hasImport && hasRoute) {
    console.log('✓ Analytics route properly configured');
  } else {
    console.log('✗ Analytics route NOT properly configured');
    if (!hasImport) console.log('  Missing import statement');
    if (!hasRoute) console.log('  Missing Route component');
    allChecksPass = false;
  }
} catch (error) {
  console.log('✗ Could not read frontend/src/App.jsx');
  allChecksPass = false;
}

// Check 8: Analytics link in Navbar
console.log('\nCheck 8: Analytics link in Navbar...');
try {
  const navbarJsx = fs.readFileSync('frontend/src/components/Navbar.jsx', 'utf8');
  const hasLink = navbarJsx.includes('<Link to="/analytics"');
  
  if (hasLink) {
    console.log('✓ Analytics link in Navbar');
  } else {
    console.log('✗ Analytics link NOT in Navbar');
    allChecksPass = false;
  }
} catch (error) {
  console.log('✗ Could not read frontend/src/components/Navbar.jsx');
  allChecksPass = false;
}

// Summary
console.log('\n' + '='.repeat(40));
if (allChecksPass) {
  console.log('✓ ALL CHECKS PASSED');
  console.log('\nNext steps:');
  console.log('1. Start backend: cd backend && npm start');
  console.log('2. Start frontend: cd frontend && npm run dev');
  console.log('3. Login to your account');
  console.log('4. Complete at least one interview');
  console.log('5. Visit /analytics to see your data');
  console.log('\nTo test the API:');
  console.log('  node test-analytics.js');
} else {
  console.log('✗ SOME CHECKS FAILED');
  console.log('\nPlease fix the issues above before proceeding.');
}
console.log('='.repeat(40));
