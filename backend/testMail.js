require('dotenv').config();
const { sendWelcomeEmail, sendPaymentConfirmationEmail } = require('./utils/mailer');

async function test() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Missing EMAIL_USER or EMAIL_PASS in .env');
    process.exit(1);
  }

  const testEmail = process.argv[2] || 'rabah.rihabing@gmail.com';
  const testName = process.argv[3] || 'Test';
  const testType = process.argv[4] || 'welcome'; // 'welcome' or 'payment'

  console.log('--- GymRat Mailer Test ---');
  console.log('Recipient:', testEmail);
  console.log('Name:', testName);
  console.log('Type:', testType);
  console.log('--------------------------');

  if (testType === 'welcome') {
    console.log('[SENDING] Welcome email only (Standard plan)...');
    await sendWelcomeEmail(testEmail, testName);
  } else if (testType === 'payment') {
    console.log('[SENDING] Welcome email + Payment confirmation (Business plan)...');
    await sendWelcomeEmail(testEmail, testName);
    await sendPaymentConfirmationEmail(testEmail, testName, 'Business', 4990, 'card');
  }

  console.log('[DONE] Check inbox (and spam folder).');
}

test();
