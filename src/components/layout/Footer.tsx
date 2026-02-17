import Link from "next/link";
import { Phone, MapPin, Mail, Instagram, Facebook } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-royal-blue text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold font-display text-royal-gold">Tanwar Tailor</h3>
                        <p className="text-gray-300 max-w-xs">
                            Ladies & Gents Alteration Specialist. Specialized in custom stitching, bridal dresses, and fitting.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {/* Social Placeholders */}
                            <a href="#" className="text-gray-300 hover:text-royal-gold transition-colors">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-royal-gold transition-colors">
                                <Facebook className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold font-display text-royal-gold">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#services" className="text-gray-300 hover:text-white transition-colors">Services</Link></li>
                            <li><Link href="#gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</Link></li>
                            <li><Link href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold font-display text-royal-gold">Contact Us</h4>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-royal-gold mt-1 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">
                                    Near Tehsil, Behind Sana Fashion & Pakija Collection,<br />
                                    Mochivada Road, Sikar, Rajasthan, India
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-royal-gold flex-shrink-0" />
                                <div className="text-gray-300 text-sm flex flex-col">
                                    <a href="tel:+918769972001" className="hover:text-white">+91-876-997-2001</a>
                                    <a href="tel:+919351650955" className="hover:text-white">+91-935-165-0955</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Tanwar Tailor. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
