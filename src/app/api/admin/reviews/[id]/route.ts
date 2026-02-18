import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { isApproved } = await req.json();

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { isApproved },
            { new: true }
        );

        if (!updatedReview) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        return NextResponse.json(updatedReview, { status: 200 });
    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting review:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
