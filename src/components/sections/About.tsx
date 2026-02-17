"use client";

import SectionWrapper from "@/components/ui/SectionWrapper";
import { Scissors, Ruler, Shirt } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: <Scissors className="w-8 h-8 text-royal-gold" />,
        title: "Expert Alterations",
        description: "Precision fitting for both ladies and gents garments. We give your old clothes a new life.",
    },
    {
        icon: <Ruler className="w-8 h-8 text-royal-gold" />,
        title: "Custom Stitching",
        description: "From bridal gowns to kurta pajamas, we stitch outfits that fit your personality perfectly.",
    },
    {
        icon: <Shirt className="w-8 h-8 text-royal-gold" />,
        title: "Premium Finish",
        description: "High-quality thread work and finishing that matches top fashion brands.",
    },
];

const About = () => {
    return (
        <SectionWrapper id="about" className="bg-white">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold font-display text-royal-blue mb-4"
                >
                    Signature Craftsmanship
                </motion.h2>
                <div className="w-24 h-1 bg-royal-gold mx-auto mb-6" />
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-lg"
                >
                    At <span className="text-royal-blue font-semibold">Tanwar Tailor</span>, we believe that perfect fit is not a luxury, it's a necessity.
                    With years of experience in Sikar, we specialize in transforming fabrics into elegant outfits and adjusting your favorite clothes
                    to fit like a glove. Whether it is a heavy bridal gown or a simple shirt alteration, we handle every stitch with care and precision.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className="p-8 rounded-xl bg-off-white border border-gray-100 hover:shadow-lg transition-shadow text-center group"
                    >
                        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-royal-blue mb-3 font-display">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default About;
