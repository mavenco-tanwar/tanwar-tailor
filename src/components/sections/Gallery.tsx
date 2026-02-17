"use client";

import SectionWrapper from "@/components/ui/SectionWrapper";
import Image from "next/image";
import { motion } from "framer-motion";

const images = [
    { src: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80", alt: "Suit Stitching" },
    { src: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80", alt: "Measurement" },
    { src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80", alt: "Ladies Dress" },
    { src: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80", alt: "Fabric Selection" },
    { src: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80", alt: "Mens Kurta" },
    { src: "https://images.unsplash.com/photo-1537832816519-0439447f0edf?auto=format&fit=crop&q=80", alt: "Embroidery Work" },
];

const Gallery = () => {
    return (
        <SectionWrapper id="gallery" className="bg-white">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-display text-royal-blue mb-4">
                    Our Latest Work
                </h2>
                <div className="w-24 h-1 bg-royal-gold mx-auto mb-6" />
                <p className="text-gray-600 max-w-2xl mx-auto">
                    A glimpse into our craftsmanship and the perfect fits we deliver.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative overflow-hidden rounded-lg shadow-lg aspect-square"
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-lg font-semibold tracking-wider font-display">
                                {image.alt}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default Gallery;
