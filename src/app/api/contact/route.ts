
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function POST(request: Request) {
    try {
        const { name, phone, service, message } = await request.json();

        // 1. Send Email to Tailor
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'tailortanwar@gmail.com',
            subject: `New Contact Query from ${name}`,
            text: `
        Name: ${name}
        Phone: ${phone}
        Service: ${service}
        Message: ${message}
      `,
            html: `
        <h3>New Contact Query</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send message.' },
            { status: 500 }
        );
    }
}


