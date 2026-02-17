import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Verify Auth
        const cookieStore = await cookies();
        const token = cookieStore.get("admin_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        try {
            await jwtVerify(token, secret);
        } catch (error) {
            console.log("Token verification failed:", error);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Calculate stats
        const totalContacts = await Contact.countDocuments({});
        const unreadContacts = await Contact.countDocuments({ isRead: false });

        // Get today's contacts (from midnight today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayContacts = await Contact.countDocuments({
            createdAt: { $gte: today },
        });

        const stats = {
            totalContacts,
            unreadContacts,
            todayContacts,
            systemStatus: "active",
        };

        return NextResponse.json(stats, { status: 200 });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
