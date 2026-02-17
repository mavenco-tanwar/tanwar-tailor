"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Phone, Calendar } from "lucide-react";
import Image from "next/image";

const Hero = () => {
    // Placeholder image for Hero background if needed, or use a gradient.
    // I'll use a gradient + pattern for now to look premium without needing an external asset yet.

    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-royal-blue text-white">
            {/* Background Pattern/Image Overlay */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80')] bg-cover bg-center" />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-royal-blue/90 via-royal-blue/50 to-royal-blue/30" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-royal-gold/20 text-royal-gold border border-royal-gold/30 text-sm font-semibold mb-6 tracking-wide">
                        ESTD. 2014
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6">
                        Tanwar <span className="text-royal-gold">Tailor</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
                        Ladies & Gents Alteration Specialist. <br />
                        Wait less, wear better with our premium custom stitching.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg"
                            onClick={() => window.location.href = 'contact'}>
                            <Calendar className="mr-2 h-5 w-5" />
                            Book Apppointment
                        </Button>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg border-white text-white hover:bg-white/10 hover:text-white"
                            onClick={() => window.location.href = 'tel:+918769972001'}>
                            <Phone className="mr-2 h-5 w-5" />
                            Call Now
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-1 h-1 bg-royal-gold rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
