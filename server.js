/** @format */

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your email service credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ask@rats24.com",
    pass: "dbec kbqn rwpa iegj", // This must be an app password for ask@rats24.com
  },
});

app.post("/api/contact", async (req, res) => {
  const { firstName, lastName, email, phone, message, serviceType } = req.body;

  try {
    await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${email}>`,
      to: "bakar75060@gmail.com", // Your receiving email
      subject: `New Contact Form Submission (${serviceType || "General"})`,
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone}
        Service Type: ${serviceType}
        Message: ${message}
      `,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/newsletter", async (req, res) => {
  const { email } = req.body;
  // For now, just log the email. In production, save to DB or send to a service.
  console.log("New newsletter subscription:", email);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
