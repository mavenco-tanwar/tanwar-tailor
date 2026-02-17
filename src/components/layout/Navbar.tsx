"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/#about" },
        { name: "Services", href: "/#services" },
        // { name: "Gallery", href: "/#gallery" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-20">
                        <Link href="/" className="flex items-center gap-2 font-playfair">
                            <Scissors className="h-6 w-6 text-royal-blue" />
                            <h1 className="text-xl font-bold tracking-wider text-royal-blue">
                                Tanwar <span className="text-[#c5a059]">Tailor</span>
                            </h1>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-700 hover:text-royal-gold transition-colors font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Button variant="primary" className="ml-4">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Now
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-royal-blue focus:outline-none"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-royal-gold hover:bg-gray-50 rounded-md"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4">
                                <Button variant="primary" className="w-full justify-center">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Now
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
