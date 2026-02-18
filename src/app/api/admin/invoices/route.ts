import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Invoice from "@/models/Invoice";
import { z } from "zod";
import * as crypto from "crypto";

const invoiceItemSchema = z.object({
    description: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
    total: z.number().min(0),
});

const createInvoiceSchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    customerPhone: z.string().min(10, "Valid phone number is required"),
    customerEmail: z.string().email().optional().or(z.literal("")),
    customerAddress: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
    subtotal: z.number(),
    tax: z.number().default(0),
    discount: z.number().default(0),
    grandTotal: z.number(),
    paidAmount: z.number().default(0),
    status: z.enum(["Paid", "Unpaid", "Partial"]).default("Unpaid"),
    dueDate: z.string().transform((str) => new Date(str)),
});

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        let query: any = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { customerName: { $regex: search, $options: "i" } },
                { invoiceNumber: { $regex: search, $options: "i" } },
                { customerPhone: { $regex: search, $options: "i" } },
            ];
        }

        const invoices = await Invoice.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Invoice.countDocuments(query);

        return NextResponse.json({
            invoices,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        console.log("POST Invoice Body:", body);
        const validatedData = createInvoiceSchema.parse(body);
        console.log("POST Validated Data:", validatedData);

        // Generate Invoice Number: TT-YYYY-XXX
        const year = new Date().getFullYear();
        const lastInvoice = await Invoice.findOne({
            invoiceNumber: new RegExp(`^TT-${year}-`),
        }).sort({ createdAt: -1 });

        let sequence = 1;
        if (lastInvoice) {
            const lastNum = parseInt(lastInvoice.invoiceNumber.split("-")[2]);
            sequence = lastNum + 1;
        }

        const invoiceNumber = `TT-${year}-${sequence.toString().padStart(3, "0")}`;

        // Generate unique share slug
        const shareSlug = crypto.randomBytes(16).toString("hex");

        const newInvoice = new Invoice({
            ...validatedData,
            invoiceNumber,
            shareSlug,
        });

        await newInvoice.save();

        return NextResponse.json(newInvoice, { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.flatten() }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
