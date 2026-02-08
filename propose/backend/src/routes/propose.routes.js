import express from 'express';
import Response from '../models/Response.model.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Email Transporter (Optional)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// POST: Save Response
router.post('/', async (req, res) => {
    try {
        const { name, response, message } = req.body;
        
        // Validation
        if (!response || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Response and message are required' 
            });
        }
        
        if (!['yes', 'no', 'maybe'].includes(response)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid response type' 
            });
        }
        
        // Save to MongoDB
        const newResponse = new Response({
            name: name || 'Anonymous',
            response,
            message
        });
        
        await newResponse.save();
        
        // Send Email Notification (Optional)
        if (process.env.EMAIL_USER && process.env.EMAIL_TO) {
            const emoji = response === 'yes' ? '💖' : response === 'no' ? '🤍' : '🤔';
            
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_TO,
                subject: `New Response: ${response.toUpperCase()} ${emoji}`,
                html: `
                    <h2>Someone responded to your proposal!</h2>
                    <p><strong>Name:</strong> ${name || 'Anonymous'}</p>
                    <p><strong>Response:</strong> ${response.toUpperCase()} ${emoji}</p>
                    <p><strong>Message:</strong></p>
                    <blockquote>${message}</blockquote>
                    <p><em>Received at: ${new Date().toLocaleString()}</em></p>
                `
            };
            
            transporter.sendMail(mailOptions).catch(err => {
                console.error('Email send error:', err);
            });
        }
        
        res.status(201).json({ 
            success: true,
            message: 'Response saved successfully'
        });
        
    } catch (error) {
        console.error('Error saving response:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error' 
        });
    }
});

// GET: Retrieve all responses (Optional - for admin)
router.get('/', async (req, res) => {
    try {
        const responses = await Response.find().sort({ createdAt: -1 });
        res.json({ success: true, data: responses });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

export default router;