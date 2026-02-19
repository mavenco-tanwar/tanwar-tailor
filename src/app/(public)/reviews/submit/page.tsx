"use client";

import { useState, useEffect, Suspense } from "react";
import { Star, Send, CheckCircle2, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { isValidIndianMobile } from "@/lib/validation";

function ReviewForm() {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        rating: 0,
        message: "",
    });

    useEffect(() => {
        const name = searchParams.get("name");
        const phone = searchParams.get("phone");
        if (name || phone) {
            setFormData(prev => ({
                ...prev,
                name: name || prev.name,
                phone: phone || prev.phone
            }));
        }
    }, [searchParams]);

    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.rating === 0) {
            setError("Please select a rating");
            return;
        }

        if (!isValidIndianMobile(formData.phone)) {
            setError("Please enter a valid Indian mobile number.");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json();
                setError(data.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Failed to submit review. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h1>
                    <p className="text-slate-600 mb-8 text-lg">
                        Your review has been submitted successfully. It will be visible on our website after a quick moderation check.
                    </p>
                    <Link
                        href="/reviews"
                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        View Other Reviews
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto mt-16">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-slate-900 p-8 text-white">
                        <h1 className="text-3xl font-bold mb-2 text-gold-500">Share Your Experience</h1>
                        <p className="text-slate-400">
                            Your feedback helps us improve and helps others choose the best tailoring service.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Overall Rating
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            className={`w-10 h-10 ${star <= (hoverRating || formData.rating)
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-slate-300"
                                                } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-black"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Mobile Number
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    placeholder="+91 9876543210"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-black"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                                Your Review
                            </label>
                            <textarea
                                id="message"
                                required
                                rows={5}
                                placeholder="How was your experience with Tanwar Tailor?"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-black resize-none"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:bg-slate-400 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Review
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function SubmitReviewPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
            </div>
        }>
            <ReviewForm />
        </Suspense>
    );
}
