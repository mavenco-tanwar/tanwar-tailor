"use client";

import { useState, useEffect } from "react";
import { Star, Plus, MessageSquare, Quote } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";

interface Review {
    _id: string;
    name: string;
    rating: number;
    message: string;
    createdAt: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch("/api/reviews");
                const data = await res.json();
                if (res.ok) {
                    setReviews(data.reviews);
                    setStats({
                        totalReviews: data.totalReviews,
                        averageRating: data.averageRating,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-20 px-4">
                <div className="max-w-6xl mx-auto text-center mt-14">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6 text-gold-500"
                    >
                        Customer Reviews
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
                    >
                        See what our clients have to say about our premium tailoring and alteration services.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex flex-col md:flex-row items-center gap-8 bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
                    >
                        <div className="text-center md:border-r md:border-white/10 md:pr-8">
                            <div className="text-5xl font-bold text-amber-400 mb-2">{stats.averageRating}</div>
                            <div className="flex gap-1 mb-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        className={`w-5 h-5 ${s <= Math.round(stats.averageRating) ? "fill-amber-400 text-amber-400" : "text-white/20"}`}
                                    />
                                ))}
                            </div>
                            <div className="text-slate-400 text-sm">Based on {stats.totalReviews} reviews</div>
                        </div>

                        <Link
                            href="/reviews/submit"
                            className="px-8 py-4 bg-royal-gold hover:bg-royal-gold-light text-white font-bold rounded-xl transition-all flex items-center gap-2 group shadow-lg shadow-amber-500/20"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            Write a Review
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Reviews List */}
            <section className="py-20 px-4 max-w-6xl mx-auto">
                {reviews.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                        <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">No reviews yet</h2>
                        <p className="text-slate-500 mb-8">Be the first one to share your experience!</p>
                        <Link
                            href="/reviews/submit"
                            className="text-amber-600 font-semibold hover:text-amber-700 underline"
                        >
                            Submit your review now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review, idx) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx % 3 * 0.1 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all hover:-translate-y-1"
                            >
                                <div className="absolute top-6 right-6 text-slate-100 group-hover:text-amber-100 transition-colors">
                                    <Quote className="w-10 h-10 fill-current" />
                                </div>

                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className={`w-4 h-4 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                                        />
                                    ))}
                                </div>

                                <p className="text-slate-700 mb-6 italic line-clamp-4">
                                    "{review.message}"
                                </p>

                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{review.name}</h3>
                                        <p className="text-slate-400 text-sm">
                                            {format(new Date(review.createdAt), "MMM dd, yyyy")}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase">
                                        {review.name[0]}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
