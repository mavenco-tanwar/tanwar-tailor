import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import nodemailer from "nodemailer";
import { isValidIndianMobile } from "@/lib/validation";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { name, email, phone, message } = await req.json();

        if (!name || !email || !phone || !message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        if (!isValidIndianMobile(phone)) {
            return NextResponse.json(
                { error: "Invalid Indian mobile number" },
                { status: 400 }
            );
        }

        const newContact = await Contact.create({
            name,
            email,
            phone,
            message,
        });

        // Email Notification Logic (Bonus)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to admin
            subject: `New Contact Query from ${name}`,
            html: `
          <h2>New Contact Query</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
        };

        // Send email asynchronously without blocking the response
        transporter.sendMail(mailOptions).catch((err) => {
            console.error("Failed to send email notification:", err);
        });

        return NextResponse.json(
            { message: "Message sent successfully", contact: newContact },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error submitting contact form:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
