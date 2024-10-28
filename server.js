const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "https://hualnet.vercel.app/", // Update this to your actual Vercel URL
  })
);
app.use(express.json());

// Endpoint to handle email sending
app.post("/send-email", async (req, res) => {
  const { from_email, from_name, mobile, message, position } = req.body;

  // Ensure required fields are present
  if (!from_email || !from_name || !message) {
    return res
      .status(400)
      .send("Missing required fields: from_email, from_name, or message.");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Gmail address from .env
        pass: process.env.GMAIL_APP_PASSWORD, // App Password from .env
      },
    });

    const mailOptions = {
      from: from_email || process.env.GMAIL_USER, // Sender email
      to: process.env.GMAIL_USER, // Receiver email
      subject: position
        ? `Job Application for ${position}`
        : "Contact Us Message",
      text: `
        You have received a new message from ${from_name} (${from_email}):
        
        Mobile: ${mobile || "N/A"}
        Message: ${message}
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully: " + result.response);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email: " + error.message);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
