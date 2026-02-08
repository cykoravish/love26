import express from "express";
import Response from "../models/Response.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST: Save Response
router.post("/", async (req, res) => {
  try {
    const { name, response, message, otherEmail } = req.body;

    // Validation
    if (!response || !message) {
      return res.status(400).json({
        success: false,
        error: "Response and message are required",
      });
    }

    if (!["yes", "no", "maybe"].includes(response)) {
      return res.status(400).json({
        success: false,
        error: "Invalid response type",
      });
    }

    // Save to MongoDB
    const newResponse = new Response({
      name: name || "Anonymous",
      response,
      message,
      otherEmail: otherEmail || null,
    });

    await newResponse.save();

if (process.env.EMAIL_USER && process.env.EMAIL_TO) {
    try {
        const emoji = response === 'yes' ? '💖' : response === 'no' ? '🤍' : '🤔';
        const responseText = response === 'yes' ? 'YES' : response === 'no' ? 'NO' : 'MAYBE';
        
        // Decide recipient: other person's email OR your email
        const recipientEmail = otherEmail || process.env.EMAIL_TO;
        const isForOther = !!otherEmail;
        
        // Email HTML Template
        const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            background: linear-gradient(135deg, #fff0f6 0%, #ffe4ec 100%);
            padding: 20px;
            margin: 0;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(214, 51, 132, 0.25);
        }
        .header {
            background: linear-gradient(135deg, #ff6b9d 0%, #c23866 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        .header::before {
            content: '💕';
            position: absolute;
            top: 10px;
            left: 20px;
            font-size: 30px;
            animation: float 3s ease-in-out infinite;
        }
        .header::after {
            content: '💖';
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: 30px;
            animation: float 3s ease-in-out infinite 1.5s;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .badge {
            background: rgba(255, 255, 255, 0.3);
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            display: inline-block;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 15px;
            border: 2px solid rgba(255, 255, 255, 0.5);
        }
        .header h1 {
            color: white;
            font-size: 32px;
            margin: 10px 0;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .emoji-big {
            font-size: 80px;
            margin: 20px 0;
            display: block;
            animation: heartbeat 1.5s ease-in-out infinite;
        }
        @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1); }
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 20px;
            color: #5a2d47;
            margin-bottom: 25px;
            line-height: 1.6;
            text-align: center;
            font-style: italic;
        }
        .info-card {
            background: linear-gradient(135deg, #fff5f8 0%, #ffe8f0 100%);
            border-radius: 20px;
            padding: 25px;
            margin: 20px 0;
            border: 2px solid #ffc0d9;
            box-shadow: 0 5px 15px rgba(255, 182, 193, 0.3);
        }
        .info-label {
            color: #c23866;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-value {
            color: #5a2d47;
            font-size: 18px;
            line-height: 1.5;
        }
        .response-badge {
            display: inline-block;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 22px;
            font-weight: bold;
            margin: 15px 0;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        .response-yes {
            background: linear-gradient(135deg, #ff6b9d, #c23866);
            color: white;
        }
        .response-no {
            background: linear-gradient(135deg, #b8b8b8, #8a8a8a);
            color: white;
        }
        .response-maybe {
            background: linear-gradient(135deg, #9b59b6, #6c3483);
            color: white;
        }
        .message-box {
            background: white;
            border-left: 5px solid #ff6b9d;
            padding: 25px;
            margin: 25px 0;
            border-radius: 15px;
            font-style: italic;
            color: #495057;
            font-size: 17px;
            line-height: 1.8;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            position: relative;
        }
        .message-box::before {
            content: '"';
            position: absolute;
            top: -10px;
            left: 15px;
            font-size: 60px;
            color: #ffc0d9;
            font-family: Georgia, serif;
        }
        .divider {
            height: 2px;
            background: linear-gradient(to right, transparent, #ffc0d9, transparent);
            margin: 30px 0;
        }
        .footer {
            background: linear-gradient(135deg, #fff5f8 0%, #ffe8f0 100%);
            padding: 30px;
            text-align: center;
            border-top: 3px solid #ffc0d9;
        }
        .timestamp {
            color: #999;
            font-size: 14px;
            margin-bottom: 15px;
        }
        .love-note {
            color: #c23866;
            font-size: 16px;
            font-style: italic;
            margin-top: 15px;
            font-weight: 600;
        }
        .hearts-row {
            font-size: 20px;
            margin: 15px 0;
            letter-spacing: 5px;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="header">
            <div class="badge">✨ Propose Day 2026 ✨</div>
            <span class="emoji-big">${emoji}</span>
            <h1>${isForOther ? 'Someone Special Sent You a Message!' : 'New Response Received!'}</h1>
        </div>
        
        <div class="content">
            <p class="greeting">
                ${isForOther 
                    ? `${name === 'Anonymous' ? 'Someone special' : name} ne aapko Propose Day ke special din pe ek pyaara message bheja hai! 💕`
                    : `Tumhare proposal ka response aa gaya hai! 💌`
                }
            </p>
            
            <div class="info-card">
                <div class="info-label">👤 From</div>
                <div class="info-value">${name || 'Anonymous'}</div>
            </div>
            
            <div class="info-card">
                <div class="info-label">💬 Their Response</div>
                <div>
                    <span class="response-badge response-${response}">
                        ${responseText} ${emoji}
                    </span>
                </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="info-label" style="margin-bottom: 15px;">💌 Their Heartfelt Message</div>
            <div class="message-box">
                ${message}
            </div>
            
            ${response === 'yes' ? 
                `<div class="hearts-row">💕 💖 💗 💓 💝 💕 💖</div>
                <p style="text-align: center; color: #c23866; font-size: 18px; font-weight: bold; margin-top: 20px;">
                    Congratulations! Yeh pal humesha ke liye yaad rakhna! 🎉
                </p>` 
                : ''
            }
        </div>
        
        <div class="footer">
            <p class="timestamp">
                📅 Received on: ${new Date().toLocaleString('en-IN', { 
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'full',
                    timeStyle: 'short'
                })}
            </p>
            <div class="hearts-row">💕 💖 💗</div>
            <p class="love-note">
                Made with love on Propose Day 💕<br>
                "Pyaar ko izhar karne ka sabse khoobsurat din!"
            </p>
        </div>
    </div>
</body>
</html>
        `;
        
        const mailOptions = {
            from: `"One Question 💖" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: `💌 ${isForOther ? `${name} sent you a Propose Day message` : 'New Propose Day Response'} ${emoji}`,
            html: emailHTML
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to: ${recipientEmail}`);
        
    } catch (emailError) {
        console.error('❌ Email send error:', emailError.message);
        // Continue even if email fails - data is still saved
    }
}

    res.status(201).json({
      success: true,
      message: "Response saved successfully",
    });
  } catch (error) {
    console.error("Error saving response:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// GET: Retrieve all responses (Optional - for admin)
router.get("/", async (req, res) => {
  try {
    const responses = await Response.find().sort({ createdAt: -1 });
    res.json({ success: true, data: responses });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
