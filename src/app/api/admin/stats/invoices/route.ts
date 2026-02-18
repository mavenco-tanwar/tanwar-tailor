import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Invoice from "@/models/Invoice";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const stats = await Invoice.aggregate([
            {
                $group: {
                    _id: null,
                    totalInvoices: { $sum: 1 },
                    totalRevenue: { $sum: "$grandTotal" },
                    paidInvoices: {
                        $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] },
                    },
                    unpaidInvoices: {
                        $sum: { $cond: [{ $eq: ["$status", "Unpaid"] }, 1, 0] },
                    },
                    partialInvoices: {
                        $sum: { $cond: [{ $eq: ["$status", "Partial"] }, 1, 0] },
                    },
                    pendingAmount: {
                        $sum: {
                            $cond: [{ $ne: ["$status", "Paid"] }, "$grandTotal", 0],
                        },
                    },
                },
            },
        ]);

        const result = stats[0] || {
            totalInvoices: 0,
            totalRevenue: 0,
            paidInvoices: 0,
            unpaidInvoices: 0,
            partialInvoices: 0,
            pendingAmount: 0,
        };

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
