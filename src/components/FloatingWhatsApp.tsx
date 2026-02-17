"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const FloatingWhatsApp = () => {
    const phoneNumber = "918769972001"; // Primary contact for WhatsApp
    const message = "Hello! I would like to inquire about tailoring services.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20b858] transition-colors flex items-center justify-center group"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-8 h-8" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 transition-all duration-300 ease-in-out font-semibold">
                Chat with us
            </span>
        </motion.a>
    );
};

export default FloatingWhatsApp;
