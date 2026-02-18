import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Invoice from "@/models/Invoice";
import nodemailer from "nodemailer";
import { pdf } from "@react-pdf/renderer";
import React from "react";
import { InvoicePDF } from "@/components/admin/InvoicePDF";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const invoice = await Invoice.findById(id).lean();

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        if (!invoice.customerEmail) {
            return NextResponse.json(
                { error: "Customer email is required to send invoice" },
                { status: 400 }
            );
        }

        // Generate PDF Buffer
        const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();
        const arrayBuffer = await blob.arrayBuffer();
        const pdfBuffer = Buffer.from(arrayBuffer);

        // Setup Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Tanwar Tailor" <${process.env.EMAIL_USER}>`,
            to: invoice.customerEmail,
            subject: `Invoice #${invoice.invoiceNumber} from Tanwar Tailor`,
            text: `Hello ${invoice.customerName},\n\nYour invoice #${invoice.invoiceNumber} from Tanwar Tailor is ready. Total Amount: Rs. ${invoice.grandTotal}.\n\nPlease find the attached PDF for details.\n\nRegards,\nTanwar Tailor`,
            attachments: [
                {
                    filename: `Invoice_${invoice.invoiceNumber}.pdf`,
                    content: pdfBuffer,
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Email sent successfully" });
    } catch (error: any) {
        console.error("Email sending error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
