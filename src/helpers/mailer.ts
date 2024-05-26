import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { SendMailProps } from "@/types/mailer";
import generateOTP from "@/utils/generateOtp";

var transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const shareAppOnMail = async ({
  userEmail,
  url,
  inviter,
}: {
  userEmail: string;
  url: string;
  inviter: string;
}) => {
  try {
    const mailOptions = {
      from: `${process.env.SMTP_USERNAME} <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `${inviter} invited you to ${process.env.PLATFORM_NAME}!`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ${process.env.PLATFORM_NAME}</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  color: #333333;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
                  border-bottom: 1px solid #dddddd;
              }
              .content {
                  padding: 20px;
              }
              .content p {
                  line-height: 1.6;
              }
              .footer {
                  text-align: center;
                  padding: 10px 0;
                  border-top: 1px solid #dddddd;
                  margin-top: 20px;
                  font-size: 0.9em;
                  color: #888888;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Welcome to ${process.env.PLATFORM_NAME}!</h1>
              </div>
              <div class="content">
                  <p>Dear ${userEmail},</p>
                  <p>You have been invited to join ${
                    process.env.PLATFORM_NAME
                  }, a real-time chat application where you can connect with your friends and colleagues instantly.</p>
                  <p>Click the link below to join and get started:</p>
                  <p><a href="${url}" target="_blank">${
        process.env.PLATFORM_NAME
      }</a></p>
                  <p>If you did not expect this invitation, please ignore this email.</p>
                  <p>We look forward to helping you explore the features and benefits of our platform. If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:${
                    process.env.SMTP_USER
                  }">${process.env.SMTP_USER}</a>.</p>
                  <p>Thank you for joining us!</p>
                  <p>Best regards,</p>
                  <p>${inviter}</p>
                  <p>The ${process.env.PLATFORM_NAME} Team</p>
              </div>
              <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} ${
        process.env.PLATFORM_NAME
      }. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>      
        `,
    };
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("App sharing failed: ", error);
          reject(error);
        } else {
          resolve(info);
          console.log("App shared: " + info.response);
        }
      });
    });
  } catch (error: any) {
    console.error(error.message);
  }
};

export const sendVerifyMail = async ({
  userEmail,
  userId,
  userName,
}: SendMailProps) => {
  try {
    const otp = generateOTP();
    console.log("otp", otp);

    await db.unverifiedUser.update({
      where: {
        id: userId,
      },
      data: {
        verifyOtp: otp,
        verifyOtpExpiry: new Date(Date.now() + 3600000).toISOString(),
      },
    });
    const mailOptions = {
      from: `${process.env.SMTP_USERNAME} <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `Welcome to ${process.env.PLATFORM_NAME}! Verify Your Email with the OTP`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ${process.env.PLATFORM_NAME}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #dddddd;
                }
                .content {
                    padding: 20px;
                }
                .content p {
                    line-height: 1.6;
                }
                .otp {
                    font-size: 1.5em;
                    font-weight: bold;
                    color: #1e90ff;
                    text-align: center;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    padding: 10px 0;
                    border-top: 1px solid #dddddd;
                    margin-top: 20px;
                    font-size: 0.9em;
                    color: #888888;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to ${process.env.PLATFORM_NAME}!</h1>
                </div>
                <div class="content">
                    <p>Dear ${userName},</p>
                    <p>Welcome to ${
                      process.env.PLATFORM_NAME
                    }! We are thrilled to have you join our community.</p>
                    <p>To complete your registration, please verify your email address using the One-Time Password (OTP) provided below:</p>
                    <div class="otp">${otp}</div>
                    <p>Please enter this OTP on the verification page to confirm your email address. This OTP is valid for the next <strong>1 hour</strong>.</p>
                    <p>If you did not create an account with ${
                      process.env.PLATFORM_NAME
                    }, please ignore this email.</p>
                    <p>We look forward to helping you explore the features and benefits of our platform. If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:${
                      process.env.SMTP_USER
                    }">${process.env.SMTP_USER}</a>.</p>
                    <p>Thank you for joining us!</p>
                    <p>Best regards,</p>
                    <p>The ${process.env.PLATFORM_NAME} Team</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} ${
        process.env.PLATFORM_NAME
      }. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `,
    };
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("OTP sending failed: ", error);
          reject(error);
        } else {
          resolve(info);
          console.log("OTP mail sent: " + info.response);
        }
      });
    });
  } catch (error: any) {
    console.error(error.message);
  }
};
