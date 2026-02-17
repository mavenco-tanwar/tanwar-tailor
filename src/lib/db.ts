import mongoose from "mongoose";

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    // Check for MONGO_URI at runtime, not at module load time
    const MONGODB_URI = process.env.MONGO_URI;

    if (!MONGODB_URI) {
        throw new Error(
            "Please define the MONGO_URI environment variable inside .env.local\n" +
            "For Vercel: Add MONGO_URI in Dashboard → Settings → Environment Variables"
        );
    }

    // Validate connection string format
    if (!MONGODB_URI.includes("mongodb")) {
        throw new Error(
            "Invalid MONGO_URI format. Expected mongodb:// or mongodb+srv:// connection string"
        );
    }

    if (cached!.conn) {
        return cached!.conn;
    }

    if (!cached!.promise) {
        const opts = {
            bufferCommands: false,
            // Serverless-optimized timeouts
            serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB is unreachable
            socketTimeoutMS: 45000, // Close inactive connections
        };

        cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("✅ MongoDB connected successfully");
            return mongoose;
        });
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (e) {
        cached!.promise = null;
        console.error("❌ MongoDB connection failed:", e);
        throw new Error(
            `MongoDB connection failed: ${e instanceof Error ? e.message : String(e)}\n` +
            "Check: 1) MONGO_URI is correct, 2) MongoDB Atlas IP whitelist includes 0.0.0.0/0, 3) Database user has permissions"
        );
    }

    return cached!.conn;
}

export default connectDB;
