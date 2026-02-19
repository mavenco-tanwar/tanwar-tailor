"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { Phone, MapPin, Mail, Send } from "lucide-react";
import { isValidIndianMobile } from "@/lib/validation";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", phone: "", message: "" });
            } else {
                const data = await response.json();
                setStatus("error");
                setErrorMessage(data.error || "Something went wrong.");
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage("Failed to send message. Please try again.");
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidIndianMobile(formData.phone)) {
            setStatus("error");
            setErrorMessage("Please enter a valid Indian mobile number.");
            return;
        }

        handleSubmit(e);
    };

    return (
        <SectionWrapper id="contact" className="bg-royal-blue text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold font-display text-royal-gold mb-4">
                            Get In Touch
                        </h2>
                        <p className="text-gray-300 text-lg">
                            Visit us for a consultation or book an appointment. We look forward to crafting your perfect outfit.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="bg-royal-gold/20 p-3 rounded-full">
                                <MapPin className="w-6 h-6 text-royal-gold" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold">Visit Us</h4>
                                <p className="text-gray-300 mt-1">
                                    Near Tehsil, Behind Sana Fashion & Pakija Collection,<br />
                                    Mochivada Road, Sikar, Rajasthan, India
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-royal-gold/20 p-3 rounded-full">
                                <Phone className="w-6 h-6 text-royal-gold" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold">Call Us</h4>
                                <p className="text-gray-300 mt-1 flex flex-col space-y-1">
                                    <a href="tel:+918769972001" className="hover:text-royal-gold transition-colors">+91-876-997-2001</a>
                                    <a href="tel:+919351650955" className="hover:text-royal-gold transition-colors">+91-935-165-0955</a>
                                    {/* <a href="tel:+919680576405" className="hover:text-royal-gold transition-colors">+91-968-057-6405</a> */}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-royal-gold/20 p-3 rounded-full">
                                <Mail className="w-6 h-6 text-royal-gold" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold">Email Us</h4>
                                <p className="text-gray-300 mt-1">
                                    <a href="mailto:tailortanwar@gmail.com" className="hover:text-royal-gold transition-colors">tailortanwar@gmail.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 rounded-xl shadow-2xl text-gray-800">
                    <h3 className="text-2xl font-bold font-display text-royal-blue mb-6">Send us a Message</h3>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-royal-blue/50"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-royal-blue/50"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-royal-blue/50"
                                    placeholder="+91-XXX-XXX-XXXX"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-royal-blue/50"
                                placeholder="Tell us about your tailoring needs..."
                            />
                        </div>
                        <Button className="w-full mt-4" size="lg" disabled={status === "loading"}>
                            <Send className="w-4 h-4 mr-2" />
                            {status === "loading" ? "Sending..." : "Send Message"}
                        </Button>
                        {status === "success" && (
                            <p className="text-green-600 text-sm mt-2 text-center">Message sent successfully! We will contact you soon.</p>
                        )}
                        {status === "error" && (
                            <p className="text-red-600 text-sm mt-2 text-center">{errorMessage}</p>
                        )}
                    </form>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Contact;
