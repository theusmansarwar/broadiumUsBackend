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

const sendEmailToCompany = (
  { email, name, phone, service, business, query },
  res
) => {
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
                      Thank you for contacting <strong>Broadium Service</strong>. This is an automated message to confirm we have received your inquiry.Our team will review your message and get back to you as soon as possible.
                    </p>
                    <p style="margin: 16px 0; font-size: 16px;">
                      Our team will review your message and get back to you as soon as possible.For urgent issues, please contact us at <a href="tel:+12103468115"
                      style="color: #0052cc; text-decoration: none;">+1 (210) 346-8115</a>.
                    </p>
                    <p style="margin: 16px 0; font-size: 16px; font-style: italic;">Please do not reply to this email.</p>
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
      return res
        .status(500)
        .json({ status: 500, message: "Error sending email to customer" });
    }

    transporter.sendMail(adminMailOptions, (adminError, adminInfo) => {
      if (adminError) {
        console.error("Error sending email to admin:", adminError);
        return res
          .status(500)
          .json({ status: 500, message: "Error sending email to admin" });
      }

      return res
        .status(200)
        .json({ status: 200, message: "Emails sent successfully" });
    });
  });
};

module.exports = sendEmailToCompany;
