import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvoiceItem {
    description: string;
    quantity: number;
    price: number;
    total: number;
}

export interface IInvoice extends Document {
    invoiceNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress?: string;
    items: IInvoiceItem[];
    subtotal: number;
    tax: number;
    discount: number;
    grandTotal: number;
    paidAmount: number;
    status: "Paid" | "Unpaid" | "Partial";
    shareSlug: string;
    dueDate: Date;
    createdAt: Date;
}

const InvoiceSchema: Schema = new Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    customerAddress: { type: String },
    items: [
        {
            description: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            total: { type: Number, required: true },
        },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["Paid", "Unpaid", "Partial"],
        default: "Unpaid",
    },
    shareSlug: { type: String, required: true, unique: true },
    dueDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Logic for auto-generating unique invoice numbers can be handled in the API
// but we ensure the index is present.

// Force the model to use the latest schema in development
if (process.env.NODE_ENV === "development" && mongoose.models.Invoice) {
    delete (mongoose.models as any).Invoice;
}

const Invoice: Model<IInvoice> =
    mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);

export default Invoice;
