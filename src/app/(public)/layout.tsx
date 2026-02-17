import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
            <FloatingWhatsApp />
        </>
    );
}
