"use client";

import { useState, useEffect } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/admin/InvoicePDF";
import { Button } from "@/components/ui/Button";
import { Download, Scissors } from "lucide-react";
import { use } from "react";

export default function PublicInvoicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [invoice, setInvoice] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await fetch(`/api/invoices/view/${slug}`);
                const data = await res.json();
                if (res.ok) {
                    setInvoice(data);
                } else {
                    setError(data.error || "Invoice not found");
                }
            } catch (err) {
                setError("Failed to load invoice");
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvoice();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                    <Scissors className="w-12 h-12 text-royal-blue animate-pulse mx-auto" />
                    <p className="text-gray-500 font-medium">Loading your invoice...</p>
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold italic">!</div>
                    <h1 className="text-xl font-bold text-gray-900">Oops!</h1>
                    <p className="text-gray-500">{error || "We couldn't find the invoice you're looking for."}</p>
                    <div className="pt-4">
                        <Button variant="primary" onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Simple Top Bar */}
            <div className="bg-white border-b px-4 py-3 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <Scissors className="h-5 w-5 text-royal-blue" />
                    <span className="font-playfair font-bold text-royal-blue tracking-wide">
                        Tanwar <span className="text-[#c5a059]">Tailor</span>
                    </span>
                </div>

                <PDFDownloadLink
                    document={<InvoicePDF invoice={invoice} />}
                    fileName={`Invoice_${invoice.invoiceNumber}.pdf`}
                >
                    {({ loading }) => (
                        <Button
                            variant="primary"
                            className="bg-royal-blue text-sm h-9"
                            disabled={loading}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {loading ? "Preparing..." : "Download"}
                        </Button>
                    )}
                </PDFDownloadLink>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 md:p-8 flex justify-center overflow-hidden">
                <div className="bg-white w-full max-w-4xl shadow-2xl rounded-lg overflow-hidden flex flex-col">
                    <div className="bg-gray-50 border-b p-3 text-center text-xs text-gray-400">
                        Invoice View Mode
                    </div>
                    <PDFViewer className="w-full flex-1 border-none min-h-[600px]" showToolbar={false}>
                        <InvoicePDF invoice={invoice} />
                    </PDFViewer>
                </div>
            </div>

            {/* Mobile Download Float */}
            <div className="md:hidden fixed bottom-6 right-6">
                <PDFDownloadLink
                    document={<InvoicePDF invoice={invoice} />}
                    fileName={`Invoice_${invoice.invoiceNumber}.pdf`}
                >
                    {({ loading }) => (
                        <button
                            disabled={loading}
                            className="w-14 h-14 bg-[#c5a059] text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
                        >
                            <Download className="w-6 h-6" />
                        </button>
                    )}
                </PDFDownloadLink>
            </div>
        </div>
    );
}
