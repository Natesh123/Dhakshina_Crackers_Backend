const fs = require('fs');
const path = require('path');

const content = `const nodemailer = require('nodemailer');
const path = require('path');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('EMAIL_USER or EMAIL_PASS not set. Skipping email.');
    return false;
  }

  const transporter = createTransporter();
  const mailOptions = {
    from: \`"Sri Dhakshina Crackers" <\${process.env.EMAIL_USER}>\`,
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  }).format(date);
};

const generateOrderTable = (items, totalAmount) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const packingCharges = totalAmount - subtotal;
  
  const itemsHtml = items.map((i, index) => \`
    <tr>
      <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6; text-align: left; color: #374151;">\${index + 1}</td>
      <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6; text-align: left; color: #374151;">\${i.name}</td>
      <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6; text-align: center; color: #374151;">\${i.quantity}</td>
      <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6; text-align: right; color: #374151;">₹\${i.price.toFixed(2)}</td>
      <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6; text-align: right; color: #374151;">₹\${(i.price * i.quantity).toFixed(2)}</td>
    </tr>
  \`).join('');

  return \`
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
      <thead>
        <tr style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
          <th style="padding: 12px 10px; text-align: left; color: #111827; font-weight: 600;">#</th>
          <th style="padding: 12px 10px; text-align: left; color: #111827; font-weight: 600;">Item</th>
          <th style="padding: 12px 10px; text-align: center; color: #111827; font-weight: 600;">Qty</th>
          <th style="padding: 12px 10px; text-align: right; color: #111827; font-weight: 600;">Price</th>
          <th style="padding: 12px 10px; text-align: right; color: #111827; font-weight: 600;">Total</th>
        </tr>
      </thead>
      <tbody>
        \${itemsHtml}
      </tbody>
    </table>
    
    <div style="width: 100%; text-align: right; font-size: 14px; margin-bottom: 30px;">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
        <span style="color: #6b7280; margin-right: 20px;">Subtotal</span>
        <span style="color: #374151; font-weight: 500; min-width: 100px;">₹\${subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-bottom: 15px;">
        <span style="color: #6b7280; margin-right: 20px;">Packing charges (3%)</span>
        <span style="color: #374151; font-weight: 500; min-width: 100px;">₹\${packingCharges.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: flex-end; border-top: 1px solid #e5e7eb; padding-top: 12px;">
        <span style="color: #111827; font-weight: 700; margin-right: 20px;">Order Total</span>
        <span style="color: #dc2626; font-weight: 700; min-width: 100px;">₹\${totalAmount.toFixed(2)}</span>
      </div>
    </div>
  \`;
};

const getCommonTemplate = (title, orderId, customerData, items, total, showInfoBoxes = true) => {
  const currentDate = formatDate(new Date());
  const { name, phone, email, city, address } = customerData;
  
  return \`
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb;">
      
      <!-- Header -->
      <div style="background: linear-gradient(to right, #dc2626, #eab308); padding: 25px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;">
          🎆 Sri Dhakshina Crackers
        </h1>
      </div>

      <div style="padding: 30px 40px;">
        <!-- Title -->
        <h2 style="color: #dc2626; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">\${title}</h2>
        
        <p style="color: #111827; margin: 0 0 10px 0; font-size: 15px;">Hi \${name},</p>
        <p style="color: #111827; margin: 0 0 25px 0; font-size: 15px;">Thank you for your order. Here's your summary:</p>

        <!-- Order Info -->
        <div style="margin-bottom: 25px; font-size: 15px;">
          <p style="margin: 0 0 5px 0;"><strong style="color: #111827;">Order #:</strong> \${orderId}</p>
          <p style="margin: 0;"><strong style="color: #111827;">Date:</strong> \${currentDate}</p>
        </div>

        <!-- Order Table -->
        \${generateOrderTable(items, total)}

        <!-- Delivery Address -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Delivery Address</h3>
          <p style="color: #4b5563; margin: 0; font-size: 15px; line-height: 1.5;">
            \${name}, \${address}, \${city}<br/>
            Phone: \${phone}
          </p>
        </div>

        <p style="color: #4b5563; margin: 0 0 30px 0; font-size: 15px;">We'll contact you shortly to confirm payment and arrange delivery.</p>

        \${showInfoBoxes ? \`
        <!-- Important Box -->
        <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 20px; margin-bottom: 25px; border-radius: 4px;">
          <div style="color: #dc2626; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            📌 Important
          </div>
          <ul style="color: #4b5563; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>This is an order confirmation, not a payment receipt.</li>
            <li>Our team will call you to confirm your order and payment.</li>
            <li>Please keep your order number (#\${orderId}) handy for any queries.</li>
            <li>Prices shown are locked at the time of ordering.</li>
          </ul>
        </div>

        <!-- Contact Box -->
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <div style="color: #111827; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; font-size: 16px;">
            📞 Need help? Contact us
          </div>
          <div style="color: #4b5563; font-size: 14px; line-height: 1.8;">
            <p style="margin: 0;"><strong style="color: #111827;">Phone:</strong> <a href="tel:+98941 16131" style="color: #dc2626; text-decoration: none;">+91 98941 16131</a></p>
            <p style="margin: 0;"><strong style="color: #111827;">WhatsApp:</strong> <a href="https://wa.me/98941 16131" style="color: #10b981; text-decoration: none;">Chat with us</a></p>
            <p style="margin: 0;"><strong style="color: #111827;">Email:</strong> <a href="mailto:sridhakshinacrackers@gmail.com" style="color: #dc2626; text-decoration: none;">sridhakshinacrackers@gmail.com</a></p>
            <p style="margin: 0;"><strong style="color: #111827;">Hours:</strong> Mon – Sat, 9:00 AM – 8:00 PM</p>
            <p style="margin: 0;"><strong style="color: #111827;">Shop:</strong> Sivakasi, Tamil Nadu</p>
          </div>
        </div>

        <!-- Safety Box -->
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; text-align: center; color: #991b1b; font-size: 13px; line-height: 1.5;">
          ⚠️ Safety first: Always follow safety instructions when handling fireworks. Keep away from children, store in a cool dry place, and use in open spaces only.
        </div>
        \` : ''}
      </div>

      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb;">
        © 2026 Sri Dhakshina Crackers · This is an automated confirmation, please do not reply directly.
      </div>
    </div>
  \`;
};

const getAdminOrderTemplate = (orderId, customer, items, total, savings) => {
  return getCommonTemplate('New Order Received! 🎉', orderId, customer, items, total, false);
};

const getCustomerConfirmationTemplate = (orderId, customerName, items, total, savings) => {
  // Creating a dummy customerData object with just the name since it's the only thing strictly needed for the greeting
  // But wait, orderController.js only passes customerName, not full customer object. Let's fix that below if needed or just handle it here.
  // Actually, I'll update orderController to pass full customer object, or I'll just change the signature of getCustomerConfirmationTemplate.
  return getCommonTemplate('Order Confirmed!', orderId, { name: customerName, phone: 'N/A', email: 'N/A', city: 'N/A', address: 'Delivery details sent in previous email' }, items, total, true);
};

// ... Wait, orderController.js calls getCustomerConfirmationTemplate(orderId, customer_name, items, total_amount, total_savings);
// We need to change that so we can pass full details for Delivery Address.

const getCustomerStatusUpdateTemplate = (orderId, customerName, newStatus) => {
  // ... similar status update
  let statusColor = "#3b82f6";
  let statusMessage = "Your order status has been updated.";
  
  if (newStatus === "Processing") {
    statusColor = "#f59e0b";
    statusMessage = "Good news! We are now processing your order and getting your fireworks ready.";
  } else if (newStatus === "Shipped" || newStatus === "Dispatched") {
    statusColor = "#8b5cf6";
    statusMessage = "Your order has been dispatched and is on its way to you!";
  } else if (newStatus === "Completed" || newStatus === "Delivered") {
    statusColor = "#10b981";
    statusMessage = "Your order has been completed successfully. We hope you have a fantastic celebration!";
  } else if (newStatus === "Cancelled") {
    statusColor = "#ef4444";
    statusMessage = "Your order has been cancelled. If you have any questions, please contact our support team.";
  }

  return \`
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(to right, #dc2626, #eab308); padding: 25px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;">
          🎆 Sri Dhakshina Crackers
        </h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #dc2626; margin: 0 0 20px 0; font-size: 22px;">Order Status Update</h2>
        <p style="color: #111827; font-size: 16px;">Dear \${customerName},</p>
        <p style="color: #4b5563; line-height: 1.5;">This is an update regarding your order <strong>#\${orderId}</strong>.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid \${statusColor}; padding: 25px; margin: 30px 0; text-align: center; border-radius: 6px;">
          <p style="margin: 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Current Status</p>
          <h1 style="margin: 15px 0; color: \${statusColor}; font-size: 28px; text-transform: uppercase; letter-spacing: 1px;">\${newStatus}</h1>
          <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.5;">\${statusMessage}</p>
        </div>

        <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Thank you for shopping with us! If you need any assistance, feel free to reply to this email.</p>
      </div>
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb;">
        © 2026 Sri Dhakshina Crackers
      </div>
    </div>
  \`;
};

module.exports = {
  sendEmail,
  getAdminOrderTemplate,
  getCustomerConfirmationTemplate,
  getCustomerStatusUpdateTemplate
};
`

fs.writeFileSync(path.join(__dirname, 'utils', 'emailService.js'), content);
console.log('utils/emailService.js updated successfully!');
