import connectDB from "./src/lib/db";
import Invoice from "./src/models/Invoice";

async function checkData() {
    try {
        await connectDB();
        const invoices = await Invoice.find({}).limit(10).lean();
        console.log("Found", invoices.length, "invoices");
        invoices.forEach(inv => {
            console.log(`ID: ${inv._id}, Num: ${inv.invoiceNumber}, Status: ${inv.status}, Total: ${inv.grandTotal}, Paid: ${inv.paidAmount}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
