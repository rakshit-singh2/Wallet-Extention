const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());
const PORT = 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables
    pass: process.env.EMAIL_PASS // Use environment variables
  }
});

app.post('/send-email', (req, res) => {
  const { email, subject, text } = req.body;
  console.log(email, subject, text)
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use environment variables
    to: email,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
