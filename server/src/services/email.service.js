const nodemailer = require('nodemailer');
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

// Brevo HTTPS REST API (Port 443 - Never blocked by Render or cloud firewalls)
const sendViaBrevoApi = async (to, name, subject, htmlContent) => {
  const apiKey = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_PASS;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey) {
    throw new Error('Neither BREVO_API_KEY nor BREVO_SMTP_PASS is configured');
  }
  if (!senderEmail) {
    throw new Error('BREVO_SENDER_EMAIL is not configured');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Hisna Gifts', email: senderEmail },
      to: [{ email: to, name: name || to }],
      subject: subject,
      htmlContent: htmlContent,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.code || `Brevo API HTTP ${response.status}`);
  }

  return data;
};

// Nodemailer SMTP Transporter (Fallback)
const smtpPort = Number(process.env.BREVO_SMTP_PORT) || 587;
const isSecure = smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
  port: smtpPort,
  secure: isSecure,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
});

const sendMail = async ({ to, name, subject, html }) => {
  const apiKey = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_PASS;

  // 1. Try Brevo HTTPS REST API (Uses port 443 - bypasses Render SMTP port blocks)
  if (apiKey) {
    try {
      const result = await sendViaBrevoApi(to, name, subject, html);
      logger.info(`Email sent via Brevo HTTPS API: ${result.messageId || 'success'}`);
      return true;
    } catch (apiError) {
      logger.warn(`Brevo HTTPS API failed (${apiError.message}). Trying SMTP fallback...`);
    }
  }

  // 2. Fallback to Nodemailer SMTP
  const mailOptions = {
    from: `"Hisna Gifts" <${process.env.BREVO_SENDER_EMAIL}>`,
    to,
    subject,
    html,
  };
  const info = await transporter.sendMail(mailOptions);
  logger.info(`Email sent via SMTP: ${info.messageId}`);
  return true;
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
  sendOtpEmail,
  sendPasswordResetEmail,
  sendB2BQuoteNotification,
};

