const nodemailer = require('nodemailer');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, name) => {
  // In development, log OTP to console instead of sending email
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n📧 OTP for ${email}: ${otp}\n`);
    console.log(`💡 Use this OTP to verify your account (dev mode)\n`);
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"AI Hustle" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your AI Hustle Account',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; overflow: hidden;">
          <div style="padding: 40px 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🚀 AI Hustle</h1>
            <p style="margin: 10px 0 0; opacity: 0.9; font-size: 14px;">Your gateway to AI-powered earnings</p>
          </div>
          <div style="background: white; padding: 40px 30px; border-radius: 16px 16px 0 0;">
            <h2 style="margin: 0 0 10px; color: #1a1a2e; font-size: 22px;">Hello ${name}! 👋</h2>
            <p style="color: #666; line-height: 1.6; margin: 0 0 30px;">Welcome to AI Hustle! Please use the OTP below to verify your email address.</p>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 30px;">
              <p style="margin: 0 0 5px; color: rgba(255,255,255,0.8); font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Your Verification Code</p>
              <h1 style="margin: 0; color: white; font-size: 36px; letter-spacing: 8px; font-weight: 700;">${otp}</h1>
            </div>
            <p style="color: #999; font-size: 13px; line-height: 1.5;">This code expires in <strong>10 minutes</strong>. If you didn't request this, please ignore this email.</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px 30px; text-align: center;">
            <p style="margin: 0; color: #999; font-size: 12px;">© 2024 AI Hustle. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    // Fallback: log OTP to console so verification can still proceed
    console.log(`\n⚠️ Email failed — fallback OTP for ${email}: ${otp}\n`);
    return false;
  }
};

module.exports = { generateOTP, sendOTPEmail };
