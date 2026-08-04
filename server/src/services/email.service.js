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
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000,
  socketTimeout: 10000,
});

const sendOtpEmail = async (to, name, otp) => {
  try {
    const mailOptions = {
      from: `"Hisna Gifts" <${process.env.BREVO_SENDER_EMAIL}>`,
      to,
      subject: 'Verify Your Account - Hisna Gifts',
      html: `
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
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

const sendPasswordResetEmail = async (to, name, otp) => {
  try {
    const mailOptions = {
      from: `"Hisna Gifts" <${process.env.BREVO_SENDER_EMAIL}>`,
      to,
      subject: 'Reset Your Password - Hisna Gifts',
      html: `
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
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Error sending password reset email: ${error.message}`);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

module.exports = {
  sendOtpEmail,
  sendPasswordResetEmail,
};
