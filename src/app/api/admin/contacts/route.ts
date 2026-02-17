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

        const contacts = await Contact.find({}).sort({ createdAt: -1 });

        return NextResponse.json(contacts, { status: 200 });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
