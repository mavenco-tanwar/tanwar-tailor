import connectDB from "./src/lib/db";
import Invoice from "./src/models/Invoice";
import * as crypto from "crypto";

async function testPersist() {
    try {
        await connectDB();
        const testInvoice = new Invoice({
            invoiceNumber: "TEST-" + Date.now(),
            customerName: "Test User",
            customerPhone: "1234567890",
            items: [{ description: "Test Item", quantity: 1, price: 100, total: 100 }],
            subtotal: 100,
            grandTotal: 100,
            paidAmount: 25,
            status: "Partial",
            shareSlug: crypto.randomBytes(16).toString("hex"),
            dueDate: new Date()
        });

        const saved = await testInvoice.save();
        console.log("Saved PaidAmount:", saved.paidAmount);

        const fetched = await Invoice.findById(saved._id).lean();
        console.log("Fetched PaidAmount:", fetched?.paidAmount);

        if (fetched?.paidAmount === 25) {
            console.log("✅ Persistence working in test script");
        } else {
            console.log("❌ Persistence FAILED in test script. Value is:", fetched?.paidAmount);
        }

        await Invoice.findByIdAndDelete(saved._id);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testPersist();
