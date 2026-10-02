const nodemailer = require('nodemailer');
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
    from: `"Sri Dhakshina Crackers" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments: [{
      filename: 'vamsi_crackers_logo.png',
      path: path.join(__dirname, 'vamsi_crackers_logo.png'),
      cid: 'companylogo'
    }]
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

  const itemsHtml = items.map((i, index) => `
    <tr>
      <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6; text-align: left; color: #374151;">${index + 1}</td>
      <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6; text-align: left; color: #374151;">${i.name}</td>
      <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6; text-align: center; color: #374151;">${i.quantity}</td>
      <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6; text-align: right; color: #374151;">₹${i.price.toFixed(2)}</td>
      <td style="padding: 12px 10px; border-bottom: 1px solid #f3f4f6; text-align: right; color: #374151;">₹${(i.price * i.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
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
        ${itemsHtml}
      </tbody>
    </table>
    
    <div style="width: 100%; text-align: right; font-size: 14px; margin-bottom: 30px;">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
        <span style="color: #6b7280; margin-right: 20px; display: inline-block;">Subtotal</span>
        <span style="color: #374151; font-weight: 500; display: inline-block; min-width: 100px;">₹${subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: flex-end; margin-bottom: 15px;">
        <span style="color: #6b7280; margin-right: 20px; display: inline-block;">Packing charges (3% of ₹${subtotal.toFixed(2)})</span>
        <span style="color: #374151; font-weight: 500; display: inline-block; min-width: 100px;">₹${packingCharges.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: flex-end; border-top: 1px solid #e5e7eb; padding-top: 12px;">
        <span style="color: #111827; font-weight: 700; margin-right: 20px; display: inline-block;">Order Total</span>
        <span style="color: #dc2626; font-weight: 700; display: inline-block; min-width: 100px;">₹${totalAmount.toFixed(2)}</span>
      </div>
    </div>
  `;
};

const getCommonTemplate = (title, orderId, customerData, items, total, showInfoBoxes = true) => {
  const currentDate = formatDate(new Date());
  const { name, phone, email, city, address } = customerData;
  const formattedOrderId = String(orderId).padStart(4, '0');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb;">
      
      <!-- Header -->
      <div style="background: linear-gradient(to right, #dc2626, #eab308); padding: 25px 20px; text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 5px;">
          <img src="cid:companylogo" alt="Sri Dhakshina Crackers" style="height: 50px; width: 50px; border-radius: 8px; border: 2px solid #ffffff; background-color: #ffffff;" />
          <h1 style="margin: 0; font-size: 26px; font-weight: 700; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">
            <span style="color: #ffffff;">Sri</span> <span style="color: #fef08a;">Dhakshina</span> <span style="color: #ffffff;">Crackers</span>
          </h1>
        </div>
      </div>

      <div style="padding: 30px 40px;">
        <!-- Title -->
        <h2 style="color: #dc2626; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">${title}</h2>
        
        <p style="color: #111827; margin: 0 0 10px 0; font-size: 15px;">Hi ${name},</p>
        <p style="color: #111827; margin: 0 0 25px 0; font-size: 15px;">Thank you for your order. Here's your summary:</p>

        <!-- Order Info -->
        <div style="margin-bottom: 25px; font-size: 15px;">
          <p style="margin: 0 0 5px 0;"><strong style="color: #111827;">Order #:</strong> ${formattedOrderId}</p>
          <p style="margin: 0;"><strong style="color: #111827;">Date:</strong> ${currentDate}</p>
        </div>

        <!-- Order Table -->
        ${generateOrderTable(items, total)}

        <!-- Delivery Address -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Delivery Address</h3>
          <p style="color: #4b5563; margin: 0; font-size: 15px; line-height: 1.5;">
            ${name} <br/>
            ${address}, ${city} <br/>
            Phone: ${phone}
          </p>
        </div>

        <p style="color: #4b5563; margin: 0 0 30px 0; font-size: 15px;">We'll contact you shortly to confirm payment and arrange delivery.</p>

        ${showInfoBoxes ? `
        <!-- Important Box -->
        <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 20px; margin-bottom: 25px; border-radius: 4px;">
          <div style="color: #dc2626; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            📌 Important
          </div>
          <ul style="color: #4b5563; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>This is an order confirmation, not a payment receipt.</li>
            <li>Our team will call you to confirm your order and payment.</li>
            <li>Please keep your order number (#${formattedOrderId}) handy for any queries.</li>
            <li>Prices shown are locked at the time of ordering.</li>
          </ul>
        </div>

        <!-- Contact Box -->
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <div style="color: #111827; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; font-size: 16px;">
            📞 Need help? Contact us
          </div>
          <div style="color: #4b5563; font-size: 14px; line-height: 1.8;">
            <p style="margin: 0;"><strong style="color: #111827;">Phone:</strong> <a href="tel:+98941 16131" style="color: #dc2626; text-decoration: none;">+91 9894116131</a></p>
            <p style="margin: 0;"><strong style="color: #111827;">WhatsApp:</strong> <a href="https://wa.me/9894116131" style="color: #10b981; text-decoration: none;">Chat with us</a></p>
            <p style="margin: 0;"><strong style="color: #111827;">Email:</strong> <a href="mailto:sridhakshinacrackers@gmail.com" style="color: #dc2626; text-decoration: none;">sridhakshinacrackers@gmail.com</a></p>
            <p style="margin: 0;"><strong style="color: #111827;">Hours:</strong> Mon – Sat, 9:00 AM – 8:00 PM</p>
            <p style="margin: 0;"><strong style="color: #111827;">Shop:</strong> Sivakasi, Tamil Nadu</p>
          </div>
        </div>

        <!-- Safety Box -->
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; text-align: center; color: #991b1b; font-size: 13px; line-height: 1.5;">
          ⚠️ Safety first: Always follow safety instructions when handling fireworks. Keep away from children, store in a cool dry place, and use in open spaces only.
        </div>
        ` : ''}
      </div>

      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb;">
        © 2026 Sri Dhakshina Crackers · This is an automated confirmation, please do not reply directly.
      </div>
    </div>
  `;
};

const getAdminOrderTemplate = (orderId, customer, items, total, savings) => {
  const currentDate = formatDate(new Date());
  const formattedOrderId = String(orderId).padStart(4, '0');
  const { name, phone, email, city, address } = customer;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb;">
      
      <!-- Header -->
      <div style="background: linear-gradient(to right, #1e3a8a, #3b82f6); padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">🔔 New Order Alert: #${formattedOrderId}</h1>
      </div>

      <div style="padding: 30px 40px; background-color: #ffffff;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; border-bottom: 2px solid #f3f4f6; padding-bottom: 15px;">
          <div>
            <h3 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Order Placed On</h3>
            <p style="color: #4b5563; margin: 0; font-size: 14px;">${currentDate}</p>
          </div>
          <div style="text-align: right;">
            <h3 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Order Amount</h3>
            <p style="color: #dc2626; margin: 0; font-size: 18px; font-weight: 700;">₹${total.toFixed(2)}</p>
          </div>
        </div>

        <!-- Customer Details Box -->
        <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 25px; border-radius: 4px;">
          <h3 style="color: #1e3a8a; font-weight: 600; margin: 0 0 10px 0; font-size: 16px;">Customer Details</h3>
          <p style="margin: 0 0 5px 0; font-size: 14px;"><strong style="color: #4b5563;">Name:</strong> <span style="color: #111827;">${name}</span></p>
          <p style="margin: 0 0 5px 0; font-size: 14px;"><strong style="color: #4b5563;">Phone:</strong> <span style="color: #111827;">${phone}</span></p>
          <p style="margin: 0 0 5px 0; font-size: 14px;"><strong style="color: #4b5563;">City:</strong> <span style="color: #111827;">${city}</span></p>
          <p style="margin: 0; font-size: 14px;"><strong style="color: #4b5563;">Address:</strong> <span style="color: #111827;">${address}</span></p>
        </div>

        <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">Items Ordered</h3>
        ${generateOrderTable(items, total)}

      </div>
      
      <!-- Footer -->
      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb;">
        Dhakshina Crackers Admin Notification System
      </div>
    </div>
  `;
};

// Now this signature expects the full customer object, so we must change the caller in orderController.js
const getCustomerConfirmationTemplate = (orderId, customerData, items, total, savings) => {
  return getCommonTemplate('Order Confirmed!', orderId, customerData, items, total, true);
};

const getCustomerStatusUpdateTemplate = (orderId, customerName, newStatus) => {
  const formattedOrderId = String(orderId).padStart(4, '0');
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

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(to right, #dc2626, #eab308); padding: 25px 20px; text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 5px;">
          <img src="cid:companylogo" alt="Sri Dhakshina Crackers" style="height: 50px; width: 50px; border-radius: 8px; border: 2px solid #ffffff; background-color: #ffffff;" />
          <h1 style="margin: 0; font-size: 26px; font-weight: 700; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">
            <span style="color: #ffffff;">Sri</span> <span style="color: #fef08a;">Dhakshina</span> <span style="color: #ffffff;">Crackers</span>
          </h1>
        </div>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #dc2626; margin: 0 0 20px 0; font-size: 22px;">Order Status Update</h2>
        <p style="color: #111827; font-size: 16px;">Dear ${customerName},</p>
        <p style="color: #4b5563; line-height: 1.5;">This is an update regarding your order <strong>#${formattedOrderId}</strong>.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid ${statusColor}; padding: 25px; margin: 30px 0; text-align: center; border-radius: 6px;">
          <p style="margin: 0; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Current Status</p>
          <h1 style="margin: 15px 0; color: ${statusColor}; font-size: 28px; text-transform: uppercase; letter-spacing: 1px;">${newStatus}</h1>
          <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.5;">${statusMessage}</p>
        </div>

        <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Thank you for shopping with us! If you need any assistance, feel free to reply to this email.</p>
      </div>
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb;">
        © 2026 Sri Dhakshina Crackers
      </div>
    </div>
  `;
};

module.exports = {
  sendEmail,
  getAdminOrderTemplate,
  getCustomerConfirmationTemplate,
  getCustomerStatusUpdateTemplate
};
