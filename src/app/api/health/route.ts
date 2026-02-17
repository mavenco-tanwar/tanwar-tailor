import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
    try {
        // Attempt to connect to MongoDB
        await connectDB();

        // Check connection state
        const isConnected = mongoose.connection.readyState === 1;

        if (!isConnected) {
            return NextResponse.json(
                {
                    status: "error",
                    database: "disconnected",
                    message: "Database connection is not active",
                    timestamp: new Date().toISOString(),
                },
                { status: 503 }
            );
        }

        // Return success response
        return NextResponse.json({
            status: "ok",
            database: "connected",
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || "development",
        });
    } catch (error) {
        console.error("Health check failed:", error);

        return NextResponse.json(
            {
                status: "error",
                database: "connection_failed",
                message: error instanceof Error ? error.message : "Unknown error",
                timestamp: new Date().toISOString(),
            },
            { status: 503 }
        );
    }
}
