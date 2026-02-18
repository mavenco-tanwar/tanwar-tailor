import connectDB from "./src/lib/db";
import mongoose from "mongoose";

async function inspectDB() {
    try {
        await connectDB();
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections in DB:", collections.map(c => c.name));

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`Collection: ${col.name}, Count: ${count}`);
            if (col.name === "invoices") {
                const first = await mongoose.connection.db.collection(col.name).findOne({});
                console.log("First invoice keys:", Object.keys(first || {}));
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspectDB();
