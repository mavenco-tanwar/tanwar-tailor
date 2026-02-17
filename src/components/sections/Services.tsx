"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const services = {
    gents: [
        { title: "Shirt Alteration & Fitting", price: "Starting ₹100" },
        { title: "Pant Alteration (Length/Waist)", price: "Starting ₹80" },
        { title: "T-Shirt Fitting", price: "Starting ₹80" },
        { title: "Kurta Pajama Stitching", price: "Custom" },
        { title: "Coat/Blazer Repair", price: "Custom" },
        { title: "Jeans Fitting", price: "Starting ₹100" },
    ],
    ladies: [
        { title: "Suit Stitching", price: "Custom" },
        { title: "Bridal Dresses & Gowns", price: "Premium" },
        { title: "Heavy Gowns & Gararas", price: "Custom" },
        { title: "Long Kurtis", price: "Custom" },
        { title: "Blouse Stitching", price: "Custom" },
        { title: "Complex Alterations", price: "Starting ₹150" },
    ],
};

const Services = () => {
    const [activeTab, setActiveTab] = useState<"gents" | "ladies">("gents");

    return (
        <SectionWrapper id="services" className="bg-off-white">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-display text-royal-blue mb-4">
                    Our Services
                </h2>
                <div className="w-24 h-1 bg-royal-gold mx-auto mb-6" />
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Tailored solutions for every wardrobe need.
                    {/* Select a category below to explore. */}
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-12">
                <div className="bg-white p-1 rounded-full shadow-sm border border-gray-200 inline-flex">
                    <button
                        onClick={() => setActiveTab("gents")}
                        className={cn(
                            "md:px-8 md:py-3 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                            activeTab === "gents"
                                ? "bg-royal-blue text-white shadow-md"
                                : "text-gray-500 hover:text-royal-blue"
                        )}
                    >
                        Gents Tailoring
                    </button>
                    <button
                        onClick={() => setActiveTab("ladies")}
                        className={cn(
                            "md:px-8 md:py-3 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                            activeTab === "ladies"
                                ? "bg-royal-blue text-white shadow-md"
                                : "text-gray-500 hover:text-royal-blue"
                        )}
                    >
                        Ladies Tailoring
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {services[activeTab].map((service, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg border border-gray-100 flex items-start space-x-4 hover:shadow-md transition-shadow"
                            >
                                <CheckCircle2 className="w-6 h-6 text-royal-gold flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-royal-blue text-lg">{service.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1 font-medium">{service.price}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </SectionWrapper>
    );
};

export default Services;
