const sgMail = require('@sendgrid/mail');
const winston = require('winston');

// Setup Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// SendGrid Mail Sender
const sendMail = async ({ to, name, subject, html }) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const senderEmail = process.env.SENDGRID_FROM_EMAIL || 'info@hisnagifts.com';

  if (!apiKey) {
    logger.error('Cannot send email: SENDGRID_API_KEY is not configured');
    throw new Error('SENDGRID_API_KEY is not configured in environment variables');
  }

  sgMail.setApiKey(apiKey);

  const msg = {
    to: name ? { email: to, name } : to,
    from: {
      email: senderEmail,
      name: 'Hisna Gifts',
    },
    subject,
    html,
  };

  try {
    const [response] = await sgMail.send(msg);
    logger.info(`Email sent successfully via SendGrid to ${to}. Status: ${response.statusCode}`);
    return response;
  } catch (error) {
    const errorMessage = error.response?.body?.errors
      ? JSON.stringify(error.response.body.errors)
      : error.message;
    logger.error(`SendGrid email sending failed to ${to}: ${errorMessage}`);
    throw new Error(`SendGrid email failed: ${errorMessage}`);
  }
};

const sendOtpEmail = async (to, name, otp) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Welcome to Hisna Gifts, ${name}!</h2>
        <p style="color: #555; font-size: 16px;">Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address and complete your registration.</p>
        
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <h1 style="color: #d32f2f; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        
        <p style="color: #555; font-size: 14px;">This code is valid for 10 minutes. Do not share this code with anyone.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">If you did not request this, please ignore this email.</p>
      </div>
    `;

    return await sendMail({
      to,
      name,
      subject: 'Verify Your Account - Hisna Gifts',
      html,
    });
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

const sendPasswordResetEmail = async (to, name, otp) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p style="color: #555; font-size: 16px;">Hi ${name},</p>
        <p style="color: #555; font-size: 16px;">We received a request to reset your password. Please use the following One-Time Password (OTP) to reset it.</p>
        
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <h1 style="color: #d32f2f; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        
        <p style="color: #555; font-size: 14px;">This code is valid for 10 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Hisna Gifts. All rights reserved.</p>
      </div>
    `;

    return await sendMail({
      to,
      name,
      subject: 'Reset Your Password - Hisna Gifts',
      html,
    });
  } catch (error) {
    logger.error(`Error sending password reset email: ${error.message}`);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

const sendB2BQuoteNotification = async (quoteData) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e1e1e1; border-radius: 12px; background-color: #fafafa;">
        <h2 style="color: #004D40; text-align: center; margin-bottom: 8px;">Hisna Gifts — B2B Quote Received</h2>
        <p style="text-align: center; color: #666; font-size: 14px; margin-top: 0;">Quote Ref: <strong>${quoteData.quoteNumber}</strong></p>
        
        <p style="color: #333; font-size: 16px;">Hi ${quoteData.contactName},</p>
        <p style="color: #555; font-size: 15px; line-height: 1.5;">Thank you for requesting a corporate / bulk ordering quote with <strong>Hisna Gifts</strong>. Our B2B event team has received your request and is reviewing your specifications.</p>
        
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
          <h3 style="color: #004D40; margin-top: 0; font-size: 16px; border-b: 1px solid #e2e8f0; padding-bottom: 8px;">Quote Details</h3>
          <table style="width: 100%; font-size: 14px; color: #4a5568; line-height: 1.8;">
            <tr><td style="font-weight: bold; width: 40%;">Company Name:</td><td>${quoteData.companyName}</td></tr>
            <tr><td style="font-weight: bold;">Service Type:</td><td>${quoteData.serviceType}</td></tr>
            <tr><td style="font-weight: bold;">Event Type:</td><td>${quoteData.eventType}</td></tr>
            <tr><td style="font-weight: bold;">Guest Count / Qty:</td><td>${quoteData.guestCount}</td></tr>
            <tr><td style="font-weight: bold;">Budget Range:</td><td>${quoteData.budgetRange || 'Flexible'}</td></tr>
            ${quoteData.eventDate ? `<tr><td style="font-weight: bold;">Target Event Date:</td><td>${new Date(quoteData.eventDate).toLocaleDateString()}</td></tr>` : ''}
            ${quoteData.notes ? `<tr><td style="font-weight: bold;">Notes/Requests:</td><td>${quoteData.notes}</td></tr>` : ''}
          </table>
        </div>

        <p style="color: #555; font-size: 14px; line-height: 1.5;">One of our dedicated event specialists will get back to you within 24 business hours with a detailed proposal and customized options.</p>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Hisna Gifts. Corporate & Bulk Catering Division.</p>
      </div>
    `;

    await sendMail({
      to: quoteData.email,
      name: quoteData.contactName,
      subject: `B2B Quote Confirmation [${quoteData.quoteNumber}] - Hisna Gifts`,
      html,
    });
  } catch (error) {
    logger.error(`Error sending B2B quote email: ${error.message}`);
    // Non-blocking for API submission
  }
};

module.exports = {
  sendMail,
  sendOtpEmail,
  sendPasswordResetEmail,
  sendB2BQuoteNotification,
};

