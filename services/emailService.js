const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using SMTP with Gmail
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,         // Use the host from .env
    port: process.env.EMAIL_PORT,         // Use the port from .env
    secure: process.env.EMAIL_SECURE === 'true', // Set secure based on .env
    auth: {
        user: process.env.EMAIL_USERNAME, // Your Gmail email address
        pass: process.env.EMAIL_PASSWORD,  // Your app password
    },
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME, // Set sender email from .env
        to,
        subject,
        text,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Optional: throw the error to handle it in the caller
    }
};

module.exports = { sendEmail };
