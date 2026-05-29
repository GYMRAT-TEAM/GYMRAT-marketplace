const nodemailer = require('nodemailer');

const cleanEmailUser = (process.env.EMAIL_USER || '').replace(/['"]/g, '').trim();
const cleanEmailPass = (process.env.EMAIL_PASS || '').replace(/['"]/g, '').trim();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: cleanEmailUser,
    pass: cleanEmailPass,
  },
});

const sendWelcomeEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: `"GymRat Marketplace" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to GymRat World!',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #060810; color: #ffffff; padding: 0; max-width: 600px; margin: 0 auto; border: 1px solid #710c1e; border-radius: 12px; overflow: hidden;">
          
          <!-- RED HEADER BLOCK -->
          <div style="background: linear-gradient(135deg, #9b1c1c 0%, #710c1e 100%); padding: 30px; text-align: center; border-bottom: 3px solid #e23c45;">
            <h1 style="color: #ffffff; font-size: 32px; text-transform: uppercase; margin: 0; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.4);">
              Welcome to GymRat World!
            </h1>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #e0e0e0; line-height: 1.6; margin-top: 0;">
              Dear <strong style="color: #ff5d5d;">${firstName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #e0e0e0; line-height: 1.6;">
              We're excited to have you join our fitness community. By becoming a member, you've already taken the first step toward achieving your fitness goals, building strength, and creating a healthier lifestyle.
            </p>
            
            <p style="font-size: 16px; color: #e0e0e0; line-height: 1.6;">
              At GymRat World, we are committed to providing you with the best training environment, professional support, and motivation to help you succeed every step of the way.
            </p>
            
            <!-- RED ACCENT CHECKLIST BOX -->
            <div style="background: rgba(113, 12, 30, 0.1); border: 1px solid rgba(113, 12, 30, 0.3); border-left: 5px solid #e23c45; padding: 20px; margin: 30px 0; border-radius: 6px;">
              <p style="font-size: 16px; color: #ff7d7d; margin-top: 0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Here's how to get started:</p>
              <ul style="color: #e0e0e0; font-size: 15px; line-height: 1.8; padding-left: 20px; margin-bottom: 0;">
                <li><strong style="color: #ffffff;">Visit our facility</strong> and activate your membership</li>
                <li><strong style="color: #ffffff;">Meet our trainers</strong> for guidance and workout support</li>
                <li><strong style="color: #ffffff;">Explore our classes</strong>, equipment, and fitness programs</li>
                <li><strong style="color: #ffffff;">Discover our GymRat World app</strong> to track workouts, schedules, progress, and exclusive member updates</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; color: #e0e0e0; line-height: 1.6;">
              If you have any questions, our team is always here to help. Simply reply to this email or contact us at <strong style="color: #ff5d5d;">+213 555 123 456</strong>.
            </p>
            
            <p style="font-size: 16px; color: #e0e0e0; line-height: 1.6; margin-bottom: 30px;">
              Thank you for choosing GymRat World. We look forward to being part of your fitness journey.
            </p>
            
            <p style="font-size: 18px; color: #ffffff; line-height: 1.4; font-weight: bold;">
              Stay strong,<br>
              <span style="color: #e23c45; text-transform: uppercase; letter-spacing: 1px; font-size: 16px;">The GymRat World Team</span>
            </p>
          </div>
          
          <div style="background-color: #04050a; padding: 20px; text-align: center; border-top: 1px solid #710c1e;">
            <p style="margin: 0; font-size: 12px; color: #666666;">
              &copy; ${new Date().getFullYear()} GymRat Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

const sendPaymentConfirmationEmail = async (email, firstName, planName, amount, paymentMethod) => {
  try {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const ticketId = 'GR' + Date.now().toString().slice(-10);
    const methodLabel = paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'baridi_mob' ? 'Baridi Mob' : paymentMethod.replace(/_/g, ' ').toUpperCase();
    const formattedAmount = (amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });

    const mailOptions = {
      from: `"GymRat Marketplace" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Payment Confirmed - GymRat ${planName} Plan`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f0f2f5; padding: 40px 20px; max-width: 600px; margin: 0 auto;">
          
          <!-- RECEIPT CARD -->
          <div style="background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08);">
            
            <!-- TOP: Thank You -->
            <div style="padding: 50px 40px 30px; text-align: center; background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);">
              <div style="font-size: 48px; margin-bottom: 16px;">&#127881;</div>
              <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 800; color: #1a1a1a;">Thank you!</h1>
              <p style="margin: 0; font-size: 15px; color: #888888; line-height: 1.5;">
                Your ${planName} Plan subscription has been<br>activated successfully
              </p>
            </div>

            <!-- DASHED SEPARATOR -->
            <div style="padding: 0 30px;">
              <div style="border-top: 2px dashed #e0e0e0; margin: 0;"></div>
            </div>

            <!-- RECEIPT DETAILS -->
            <div style="padding: 30px 40px;">
              
              <!-- TICKET ID & AMOUNT -->
              <table style="width: 100%; margin-bottom: 24px;" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: top;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #aaaaaa; font-weight: 600; margin-bottom: 6px;">TICKET ID</div>
                    <div style="font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: 0.5px;">${ticketId}</div>
                  </td>
                  <td style="vertical-align: top; text-align: right;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #aaaaaa; font-weight: 600; margin-bottom: 6px;">AMOUNT</div>
                    <div style="font-size: 18px; font-weight: 800; color: #1a1a1a;">${formattedAmount} DZD</div>
                  </td>
                </tr>
              </table>
              
              <!-- DATE & TIME -->
              <div style="margin-bottom: 24px;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #aaaaaa; font-weight: 600; margin-bottom: 6px;">DATE & TIME</div>
                <div style="font-size: 16px; font-weight: 700; color: #1a1a1a;">${dateStr} &bull; ${timeStr}</div>
              </div>

              <!-- PAYMENT METHOD & USER -->
              <div style="background: #f8f8f8; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center;">
                <table style="width: 100%;" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 40px; vertical-align: middle;">
                      <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #9b1c1c 0%, #710c1e 100%); border-radius: 50%; text-align: center; line-height: 36px; color: #fff; font-weight: 800; font-size: 14px;">GR</div>
                    </td>
                    <td style="padding-left: 14px; vertical-align: middle;">
                      <div style="font-size: 15px; font-weight: 700; color: #1a1a1a;">${firstName}</div>
                      <div style="font-size: 13px; color: #999999;">${methodLabel}</div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- PLAN DETAILS BOX -->
            <div style="padding: 0 40px 30px;">
              <div style="background: linear-gradient(135deg, #9b1c1c 0%, #710c1e 100%); border-radius: 12px; padding: 24px; color: #ffffff;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.7; margin-bottom: 8px;">YOUR ACTIVE PLAN</div>
                <div style="font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">GymRat ${planName}</div>
                <div style="font-size: 13px; opacity: 0.8;">Premium access activated. Thank you for your support!</div>
              </div>
            </div>

            <!-- FOOTER -->
            <div style="background: #fafafa; padding: 24px 40px; text-align: center; border-top: 1px solid #f0f0f0;">
              <p style="margin: 0 0 4px; font-size: 12px; color: #bbbbbb;">
                &copy; ${new Date().getFullYear()} GymRat Marketplace. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11px; color: #cccccc;">
                Questions? Contact us at support@gymrat.com
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Payment confirmation email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPaymentConfirmationEmail
};
