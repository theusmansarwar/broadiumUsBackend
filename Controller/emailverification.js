const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailToCompany = ({ email, name, phone, service, business, query }, res) => {
  // ✅ 1. Email to the Customer
  const customerMailOptions = {
    from: `"Broadium Service" <noreply@broadium.us>`,
    to: email,
    subject: `Thank You for Reaching Out – Broadium Service`,
    html: `
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table cellpadding="0" cellspacing="0" border="0" 
          style="width: 100%; background-color: #f4f4f4; padding: 20px; text-align: center;">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" 
                style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; 
                overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background-color: #0052cc; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Thank You for Contacting Broadium Service</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; text-align: left; color: #333333;">
                    <p style="margin: 0; font-size: 16px;">Dear ${name},</p>
                    <p style="margin: 16px 0; font-size: 16px;">
                      Thank you for reaching out to <strong>Broadium Service</strong>. We have received your query and our team will get back to you shortly.
                    </p>
                    <p style="margin: 16px 0; font-size: 16px;">
                      If you have any urgent concerns, please feel free to contact us via our website <a href="https://broadium.us" 
                      style="color: #0052cc; text-decoration: none;">broadium.us</a> or reach us directly at our support email.
                    </p>
                    <p style="margin: 16px 0; font-size: 16px;">We appreciate your patience and look forward to assisting you.</p>
                    <p style="margin: 16px 0; font-size: 16px;">Best regards,</p>
                    <p style="margin: 0; font-size: 16px; font-weight: bold;">Broadium Service Team</p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 14px; color: #777777;">
                    <p style="margin: 0;">&copy; 2024 Broadium Service. All rights reserved.</p>
                    <p style="margin: 0;">Visit us: <a href="https://broadium.us" style="color: #0052cc; text-decoration: none;">broadium.us</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `,
  };

  // ✅ 2. Email to the Admin
  const adminMailOptions = {
    from: "noreply@broadium.us",
    to: process.env.ADMIN_EMAIL,
    subject: `New Lead from ${name}`,
    html: `
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table cellpadding="0" cellspacing="0" border="0" 
          style="width: 100%; background-color: #f4f4f4; padding: 20px; text-align: center;">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" 
                style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; 
                overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="background-color: #d9534f; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Lead Received</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; text-align: left; color: #333333;">
                    <p style="margin: 0; font-size: 16px;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 0; font-size: 16px;"><strong>Email:</strong> ${email}</p>
                    <!-- Compose Email Button -->
                  <p style="margin: 10px 0;">
                    <a href="mailto:${email}?subject=Re: ${service}"
                      style="display: inline-block; background-color: #007BFF; color: #FFFFFF;
                      padding: 10px 20px; text-decoration: none; border-radius: 4px;
                      font-size: 14px;">
                      Compose Email
                    </a>
                  </p>
                    <p style="margin: 0; font-size: 16px;"><strong>Phone:</strong> ${phone}</p>
                    <p style="margin: 0; font-size: 16px;"><strong>Service:</strong> ${service}</p>
                    <p style="margin: 0; font-size: 16px;"><strong>Business:</strong> ${business}</p>
                    <p style="margin: 16px 0; font-size: 16px;"><strong>Query:</strong></p>
                    <p style="margin: 0; font-size: 16px;">${query}</p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 14px; color: #777777;">
                    <p style="margin: 0;">This is an automated email. Please do not reply.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `,
  };

  // Send Emails
  transporter.sendMail(customerMailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email to customer:", error);
      return res.status(500).json({ status: 500, message: "Error sending email to customer" });
    }

    transporter.sendMail(adminMailOptions, (adminError, adminInfo) => {
      if (adminError) {
        console.error("Error sending email to admin:", adminError);
        return res.status(500).json({ status: 500, message: "Error sending email to admin" });
      }

      return res.status(200).json({ status: 200, message: "Emails sent successfully" });
    });
  });
};

module.exports = sendEmailToCompany;
