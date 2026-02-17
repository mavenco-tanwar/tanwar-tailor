import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Middleware-like Auth Check (reusable function could be better but keeping it simple per file for now)
async function isAuthenticated() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return false;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        return true;
    } catch {
        return false;
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { id } = await params;

        // Validate MongoDB ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        const contact = await Contact.findById(id);

        if (!contact) {
            return NextResponse.json({ error: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json(contact, { status: 200 });
    } catch (error) {
        console.error("Error fetching contact:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { id } = await params;
        const { isRead } = await req.json();

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        const contact = await Contact.findByIdAndUpdate(
            id,
            { isRead },
            { new: true }
        );

        if (!contact) {
            return NextResponse.json({ error: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json(contact, { status: 200 });
    } catch (error) {
        console.error("Error updating contact:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { id } = await params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return NextResponse.json({ error: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Contact deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting contact:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
