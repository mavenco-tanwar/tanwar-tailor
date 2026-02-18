import connectDB from "./src/lib/db";
import Invoice from "./src/models/Invoice";
import mongoose from "mongoose";

async function checkSchema() {
    try {
        await connectDB();
        console.log("Model Name:", Invoice.modelName);
        console.log("Schema Paths:", Object.keys(Invoice.schema.paths));
        if (Invoice.schema.paths.paidAmount) {
            console.log("✅ paidAmount exists in schema");
        } else {
            console.log("❌ paidAmount MISSING from schema");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
