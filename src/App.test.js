// test/test.js
// =============================================
// SIMPLE API TEST - run with: node test/test.js
// Make sure server is running first: npm run dev
// =============================================
const axios = require('axios');

const BASE = 'http://localhost:5000/api';
let token = '';
let testEmail = `test_${Date.now()}@gymrat.com`;

const pass = (msg) => console.log(`  ✅ ${msg}`);
const fail = (msg) => console.log(`  ❌ ${msg}`);
const section = (title) => console.log(`\n📋 ${title}`);

async function run() {
  console.log('🏋️  GymRat API Tests Starting...\n');

  // ---- 1. Health Check ----
  section('Health Check');
  try {
    const res = await axios.get(`${BASE}/health`);
    pass(`Server is running: ${res.data.message}`);
  } catch {
    fail('Server not running! Start it with: npm run dev');
    process.exit(1);
  }

  // ---- 2. Sign Up ----
  section('Sign Up');
  try {
    const res = await axios.post(`${BASE}/auth/signup`, {
      name: 'Test User',
      email: testEmail,
      password: 'test1234',
    });
    token = res.data.token;
    pass(`Account created for ${testEmail}`);
    pass(`JWT token received: ${token.substring(0, 20)}...`);
  } catch (err) {
    fail(`Sign up failed: ${err.response?.data?.message}`);
  }

  // ---- 3. Sign In ----
  section('Sign In');
  try {
    const res = await axios.post(`${BASE}/auth/signin`, {
      email: testEmail,
      password: 'test1234',
    });
    token = res.data.token;
    pass(`Sign in successful for ${testEmail}`);
  } catch (err) {
    fail(`Sign in failed: ${err.response?.data?.message}`);
  }

  // ---- 4. Sign In with Admin ----
  section('Admin Sign In');
  try {
    const res = await axios.post(`${BASE}/auth/signin`, {
      email: 'admin@gymrat.com',
      password: 'admin123',
    });
    pass(`Admin signed in: ${res.data.user.name} (role: ${res.data.user.role})`);
  } catch (err) {
    fail(`Admin sign in failed: ${err.response?.data?.message}`);
  }

  // ---- 5. Wrong Password ----
  section('Invalid Credentials (should fail)');
  try {
    await axios.post(`${BASE}/auth/signin`, {
      email: testEmail,
      password: 'wrongpassword',
    });
    fail('Should have rejected wrong password!');
  } catch (err) {
    if (err.response?.status === 401) {
      pass('Correctly rejected wrong password (401)');
    }
  }

  // ---- 6. Get Products ----
  section('Products');
  try {
    const res = await axios.get(`${BASE}/products`);
    pass(`Fetched ${res.data.total} products`);
  } catch (err) {
    fail('Failed to fetch products');
  }

  // ---- 7. Search Products ----
  section('Product Search');
  try {
    const res = await axios.get(`${BASE}/products?search=protein`);
    pass(`Search "protein" returned ${res.data.total} result(s)`);
  } catch (err) {
    fail('Search failed');
  }

  // ---- 8. Get My Orders (authenticated) ----
  section('Orders (authenticated)');
  try {
    const res = await axios.get(`${BASE}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    pass(`Fetched orders. Count: ${res.data.orderCount}`);
  } catch (err) {
    fail(`Orders fetch failed: ${err.response?.data?.message}`);
  }

  // ---- 9. Protected Route without token ----
  section('Protected Route (no token - should fail)');
  try {
    await axios.get(`${BASE}/orders/my-orders`);
    fail('Should have rejected unauthenticated request!');
  } catch (err) {
    if (err.response?.status === 401) {
      pass('Correctly rejected unauthenticated request (401)');
    }
  }

  console.log('\n🎉 Tests complete!\n');
  console.log('⚠️  PayPal payment test requires real PayPal sandbox credentials.');
  console.log('   Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your .env file.\n');
}

run().catch(err => {
  console.error('Test runner error:', err.message);
});