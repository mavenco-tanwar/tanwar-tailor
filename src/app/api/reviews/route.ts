import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import { isValidIndianMobile } from "@/lib/validation";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });

        // Calculate average rating
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
            : 0;

        return NextResponse.json({
            reviews,
            totalReviews,
            averageRating: Number(averageRating)
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { name, phone, rating, message } = await req.json();

        if (!name || !phone || !rating || !message) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        if (!isValidIndianMobile(phone)) {
            return NextResponse.json({ error: "Invalid Indian mobile number" }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
        }

        const newReview = await Review.create({
            name,
            phone,
            rating,
            message,
            isApproved: false, // Moderated system
        });

        return NextResponse.json({ message: "Review submitted successfully! It will be visible after approval.", review: newReview }, { status: 201 });
    } catch (error) {
        console.error("Error submitting review:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
