const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const { CLIENT_URL } = require('../config/constants');

const transporter = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${CLIENT_URL}/verify-email/${token}`;

    const mailOptions = {
        from: `ResumeRAG <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: 'Verify Your Email for ResumeRAG',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h1 style="color: #333;">Welcome to ResumeRAG!</h1>
                <p style="font-size: 16px; color: #555;">Please click the button below to verify your email address and activate your account.</p>
                <a href="${verificationUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; margin: 20px 0; text-decoration: none; border-radius: 5px; font-size: 16px;">Verify Email</a>
                <p style="font-size: 14px; color: #777;">If you did not sign up for this account, you can safely ignore this email.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending verification email:', error);
        
    }
};

module.exports = { sendVerificationEmail };