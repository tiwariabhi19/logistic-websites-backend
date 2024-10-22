const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to handle email sending
app.post("/send-email", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your App Password
      },
    });

    const mailOptions = {
      from: req.body.from_email || process.env.GMAIL_USER, // Use the email from the form or fallback to GMAIL_USER
      to: process.env.GMAIL_USER, // Your receiving email
      subject: req.body.position
        ? `Job Application for ${req.body.position}`
        : "Contact Us Message",
      text: `
        You have received a new message from ${req.body.from_name} (${req.body.from_email}):
        
        Mobile: ${req.body.mobile}
        Message: ${req.body.message}
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent: " + result.response);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email: " + error.message);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
