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

const sendOrderConfirmationEmail = async (order) => {
  try {
    const customerEmail = order.user?.email || order.guestEmail;
    const customerName = order.user?.name || order.guestName || 'Valued Customer';

    if (!customerEmail) {
      logger.warn(`Cannot send order confirmation email for ${order.orderNumber}: No recipient email found.`);
      return;
    }

    const itemsHtmlDesktop = (order.items || [])
      .map((item) => {
        const productName = item.product?.name || 'Gift Item';
        const qty = item.quantity;
        const price = Number(item.unitPrice || 0).toFixed(2);
        const total = Number(item.totalPrice || (Number(item.unitPrice || 0) * qty)).toFixed(2);
        return `
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #edf2f7; color: #2d3748;">
              <strong>${productName}</strong>
            </td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #edf2f7; text-align: center; color: #4a5568;">${qty}</td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #edf2f7; text-align: right; color: #4a5568;">$${price}</td>
            <td style="padding: 12px 10px; border-bottom: 1px solid #edf2f7; text-align: right; font-weight: bold; color: #2d3748;">$${total}</td>
          </tr>
        `;
      })
      .join('');

    const itemsHtmlMobile = (order.items || [])
      .map((item) => {
        const productName = item.product?.name || 'Gift Item';
        const qty = item.quantity;
        const price = Number(item.unitPrice || 0).toFixed(2);
        const total = Number(item.totalPrice || (Number(item.unitPrice || 0) * qty)).toFixed(2);
        return `
          <tr>
            <td style="padding: 12px 4px; border-bottom: 1px solid #edf2f7; color: #2d3748;">
              <div style="font-weight: bold; margin-bottom: 4px;">${productName}</div>
              <div style="font-size: 13px; color: #718096;">Qty: ${qty} &times; $${price}</div>
            </td>
            <td style="padding: 12px 4px; border-bottom: 1px solid #edf2f7; text-align: right; font-weight: bold; color: #2d3748; vertical-align: top;">
              $${total}
            </td>
          </tr>
        `;
      })
      .join('');

    const stateStr = order.address?.state && order.address.state.toUpperCase() !== 'N/A' ? `${order.address.state} ` : '';
    const addressHtml = order.address
      ? `
        <p style="margin: 0; color: #4a5568; line-height: 1.6;">
          ${order.address.street}<br>
          ${order.address.city}, ${stateStr}${order.address.postalCode}<br>
          ${order.address.country || 'Canada'}
        </p>
      `
      : '<p style="margin: 0; color: #718096;">Provided at checkout</p>';

    const paymentText =
      order.paymentMethod === 'STRIPE'
        ? 'Credit / Debit Card'
        : 'Cash on Delivery';

    const shippingText =
      Number(order.shippingFee) === 0 ? 'FREE' : `$${Number(order.shippingFee).toFixed(2)} CAD`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style type="text/css">
          @media screen and (max-width: 600px) {
            .desktop-only { display: none !important; }
            .mobile-only { 
              display: table !important; 
              width: 100% !important; 
              max-height: none !important; 
              overflow: visible !important; 
            }
            .mobile-stack { 
              display: block !important; 
              width: 100% !important; 
              padding-left: 0 !important; 
              padding-right: 0 !important; 
              padding-bottom: 16px !important; 
              box-sizing: border-box !important;
            }
            .mobile-text-right { text-align: right !important; }
            .email-container { padding: 12px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 20px 0; background-color: #f7fafc;">
        <div class="email-container" style="font-family: Arial, -apple-system, BlinkMacSystemFont, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #2d3748;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #004D40;">
            <h1 style="color: #004D40; margin: 0; font-size: 26px; letter-spacing: 1.5px; font-weight: 800;">HISNA GIFTS</h1>
            <p style="color: #718096; font-size: 14px; margin-top: 6px;">Luxury Gifts & Premium Celebrations</p>
          </div>

          <div style="padding: 24px 0 16px 0;">
            <h2 style="color: #004D40; font-size: 20px; margin-top: 0; margin-bottom: 8px;">Order Confirmed: #${order.orderNumber}</h2>
            <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0 0 12px 0;">Hi <strong>${customerName}</strong>,</p>
            <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 0;">Thank you for shopping with Hisna Gifts. We have received your order and our team is already preparing it with the utmost care.</p>
          </div>

          <div style="background-color: #f7fafc; border-radius: 8px; padding: 18px; margin-bottom: 22px; border: 1px solid #edf2f7;">
            <!-- Desktop Table -->
            <table class="desktop-only" style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="border-bottom: 2px solid #cbd5e0; color: #4a5568; text-align: left;">
                  <th style="padding: 8px 10px;">Item</th>
                  <th style="padding: 8px 10px; text-align: center;">Qty</th>
                  <th style="padding: 8px 10px; text-align: right;">Price</th>
                  <th style="padding: 8px 10px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtmlDesktop}
              </tbody>
            </table>
            
            <!-- Mobile Table (Hidden on Desktop) -->
            <!--[if !mso]><!-->
            <table class="mobile-only" style="display: none; width: 0; max-height: 0; overflow: hidden; mso-hide: all; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="border-bottom: 2px solid #cbd5e0; color: #4a5568; text-align: left;">
                  <th style="padding: 8px 4px;">Item Details</th>
                  <th style="padding: 8px 4px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtmlMobile}
              </tbody>
            </table>
            <!--<![endif]-->

            <div style="margin-top: 16px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
              <table style="width: 100%; font-size: 14px; line-height: 1.8;">
                <tr>
                  <td style="color: #718096;">Subtotal:</td>
                  <td style="text-align: right; font-weight: 600; color: #2d3748;">$${Number(order.subtotal).toFixed(2)} CAD</td>
                </tr>
                <tr>
                  <td style="color: #718096;">Shipping:</td>
                  <td style="text-align: right; font-weight: 600; color: #2d3748;">${shippingText}</td>
                </tr>
                <tr style="font-size: 16px; border-top: 2px solid #004D40;">
                  <td style="padding-top: 8px; font-weight: bold; color: #004D40;">Total Amount:</td>
                  <td style="padding-top: 8px; text-align: right; font-weight: bold; color: #004D40;">$${Number(order.totalAmount).toFixed(2)} CAD</td>
                </tr>
              </table>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td class="mobile-stack" style="width: 50%; vertical-align: top; padding-right: 8px;">
                <div style="background-color: #f7fafc; padding: 14px; border-radius: 8px; border: 1px solid #edf2f7; height: 100%; min-height: 110px; box-sizing: border-box;">
                  <h3 style="margin: 0 0 8px 0; font-size: 13px; color: #004D40; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</h3>
                  ${addressHtml}
                </div>
              </td>
              <td class="mobile-stack" style="width: 50%; vertical-align: top; padding-left: 8px;">
                <div style="background-color: #f7fafc; padding: 14px; border-radius: 8px; border: 1px solid #edf2f7; height: 100%; min-height: 110px; box-sizing: border-box;">
                  <h3 style="margin: 0 0 8px 0; font-size: 13px; color: #004D40; text-transform: uppercase; letter-spacing: 0.5px;">Payment Details</h3>
                  <p style="margin: 3px 0; color: #4a5568;"><strong>Method:</strong> ${paymentText}</p>
                  <p style="margin: 3px 0; color: #4a5568;"><strong>Status:</strong> ${order.paymentStatus || 'PENDING'}</p>
                </div>
              </td>
            </tr>
          </table>

          <p style="color: #718096; font-size: 13px; line-height: 1.6; text-align: center; margin: 0 0 16px 0;">
            Need assistance or want to customize your order? Reply directly to this email or reach us at <a href="mailto:info@hisnagifts.com" style="color: #004D40; text-decoration: underline;">info@hisnagifts.com</a>.
          </p>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #a0aec0; font-size: 12px; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} Hisna Gifts. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    await sendMail({
      to: customerEmail,
      name: customerName,
      subject: `Order Confirmation #${order.orderNumber} - Hisna Gifts`,
      html,
    });

    logger.info(`Order confirmation email sent for #${order.orderNumber} to ${customerEmail}`);
  } catch (error) {
    logger.error(`Error sending order confirmation email for ${order?.orderNumber}: ${error.message}`);
  }
};

module.exports = {
  sendMail,
  sendOtpEmail,
  sendPasswordResetEmail,
  sendB2BQuoteNotification,
  sendOrderConfirmationEmail,
};

