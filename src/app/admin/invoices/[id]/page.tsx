"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Download,
    Mail,
    Printer,
    CheckCircle2,
    MessageCircle,
    Share2,
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/admin/InvoicePDF";
import { format } from "date-fns";
import Image from "next/image";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [invoice, setInvoice] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailStatus, setEmailStatus] = useState<any>(null);

    const fetchInvoice = async () => {
        try {
            const res = await fetch(`/api/admin/invoices/${id}`, { cache: "no-store" });
            const data = await res.json();
            if (res.ok) {
                setInvoice(data);
            }
        } catch (error) {
            console.error("Failed to fetch invoice", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const handleMarkAsPaid = async () => {
        try {
            const res = await fetch(`/api/admin/invoices/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "Paid",
                    paidAmount: invoice.grandTotal
                }),
            });
            if (res.ok) {
                fetchInvoice();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleSendEmail = async () => {
        try {
            setIsSendingEmail(true);
            setEmailStatus({ type: "loading", message: "Sending email..." });
            const res = await fetch(`/api/admin/invoices/${id}/send-email`, {
                method: "POST",
            });
            const data = await res.json();
            if (res.ok) {
                setEmailStatus({ type: "success", message: "Email sent successfully!" });
            } else {
                throw new Error(data.error || "Failed to send email");
            }
        } catch (error: any) {
            setEmailStatus({ type: "error", message: error.message });
        } finally {
            setIsSendingEmail(false);
            setTimeout(() => setEmailStatus(null), 5000);
        }
    };

    const shareWhatsApp = () => {
        const publicUrl = invoice.shareSlug
            ? `${window.location.origin}/invoices/view/${invoice.shareSlug}`
            : null;

        const reviewLink = `${window.location.origin}/reviews/submit?name=${encodeURIComponent(invoice.customerName)}&phone=${encodeURIComponent(invoice.customerPhone)}`;

        const message = `Hello ${invoice.customerName}, your invoice #${invoice.invoiceNumber} from Tanwar Tailor is ready. Total Amount: Rs. ${invoice.grandTotal}.\n\n${publicUrl ? `You can view and download your invoice here: ${publicUrl}` : `You can collect your order by ${format(new Date(invoice.dueDate), "dd MMM yyyy")}.`}\n\nWe would love to hear your feedback! Please share your experience here: ${reviewLink}\n\nThank you for choosing Tanwar Tailor!`;

        const encodedMsg = encodeURIComponent(message);
        window.open(`https://wa.me/${invoice.customerPhone}?text=${encodedMsg}`, "_blank");
    };

    const handleShareFile = async () => {
        const publicUrl = invoice.shareSlug
            ? `${window.location.origin}/invoices/view/${invoice.shareSlug}`
            : null;

        const reviewLink = `${window.location.origin}/reviews/submit?name=${encodeURIComponent(invoice.customerName)}&phone=${encodeURIComponent(invoice.customerPhone)}`;

        const message = `Hello ${invoice.customerName}, your invoice #${invoice.invoiceNumber} from Tanwar Tailor is ready. Total Amount: Rs. ${invoice.grandTotal}.\n\n${publicUrl ? `You can view and download your invoice here: ${publicUrl}` : ""}\n\nShare your feedback: ${reviewLink}`;

        if (navigator.share && navigator.canShare) {
            try {
                const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();
                const file = new File([blob], `Invoice_${invoice.invoiceNumber}.pdf`, { type: "application/pdf" });

                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: `Invoice ${invoice.invoiceNumber}`,
                        text: message,
                    });
                } else {
                    await navigator.share({
                        title: `Invoice ${invoice.invoiceNumber}`,
                        text: message,
                        url: publicUrl || undefined,
                    });
                }
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error("Share failed", err);
                }
            }
        } else {
            // Fallback for desktop share
            const shareUrl = publicUrl || window.location.href;
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(`${message}\n\n${shareUrl}`);
                alert("Link and message copied to clipboard!");
            }
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading invoice...</div>;
    if (!invoice) return <div className="p-8 text-center text-red-500">Invoice not found.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/invoices">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-500" />
                        </button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-gray-900 font-playfair">
                                {invoice.invoiceNumber}
                            </h1>
                            <StatusBadge status={invoice.status} />
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            Created on {format(new Date(invoice.createdAt), "dd MMM yyyy")}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {invoice.status !== "Paid" && (
                        <Button
                            variant="primary"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={handleMarkAsPaid}
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark as Paid
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        onClick={handleShareFile}
                        className="bg-[#09637E] hover:bg-[#074d61]"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share File
                    </Button>
                    <Button variant="primary" onClick={shareWhatsApp} className="bg-green-600 hover:bg-green-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSendEmail}
                        disabled={isSendingEmail || !invoice.customerEmail}
                        className="bg-[#8A7650] hover:bg-[#7a6645]"
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        {isSendingEmail ? "Sending..." : "Email PDF"}
                    </Button>

                    <PDFDownloadLink
                        document={<InvoicePDF invoice={invoice} />}
                        fileName={`Invoice_${invoice.invoiceNumber}.pdf`}
                    >
                        {({ loading }) => (
                            <Button
                                variant="primary"
                                className="bg-[#BF4646] hover:bg-[#a83a3a]"
                                disabled={loading}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {loading ? "Preparing..." : "Download PDF"}
                            </Button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            {emailStatus && (
                <div className={cn(
                    "px-4 py-3 rounded-lg text-sm border",
                    emailStatus.type === "success" ? "bg-green-50 border-green-100 text-green-700" :
                        emailStatus.type === "error" ? "bg-red-50 border-red-100 text-red-700" :
                            "bg-blue-50 border-blue-100 text-blue-700"
                )}>
                    {emailStatus.message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Invoice Preview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[800px]">
                        <div className="bg-gray-50 border-b p-4 flex justify-between items-center whitespace-nowrap overflow-x-auto">
                            <span className="text-sm font-medium text-gray-500">Live Preview</span>
                            <div className="text-xs text-gray-400">Scale might differ slightly from actual PDF</div>
                        </div>
                        {/* Rendering a simplified HTML preview since PDFViewer might be heavy and doesn't allow CSS styling easily within the same page flow */}
                        <div className="p-8 md:p-12 max-w-2xl mx-auto space-y-12 bg-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    {/* <h2 className="text-2xl font-bold text-royal-blue">Tanwar Tailor</h2> */}
                                    <Image
                                        src="/images/website-logo.png"
                                        alt="Tanwar Tailor"
                                        width={120}
                                        height={40}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Premium Bespoke Tailoring</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-lg font-bold text-gray-900">INVOICE</h3>
                                    <p className="text-sm text-gray-600">#{invoice.invoiceNumber}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Bill To</h4>
                                    <p className="font-bold text-[#1a1a2e]">{invoice.customerName}</p>
                                    <p className="text-sm text-gray-600">{invoice.customerPhone}</p>
                                    <p className="text-sm text-gray-600">{invoice.customerEmail}</p>
                                    <p className="text-sm text-gray-600">{invoice.customerAddress}</p>
                                </div>
                                <div className="space-y-2 text-right">
                                    <h4 className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Details</h4>
                                    <p className="text-sm text-gray-500"><span className="text-[#1a1a2e]">Date:</span> {format(new Date(invoice.createdAt), "dd/MM/yyyy")}</p>
                                    <p className="text-sm text-gray-500"><span className="text-[#1a1a2e]">Due:</span> {format(new Date(invoice.dueDate), "dd/MM/yyyy")}</p>
                                </div>
                            </div>

                            <table className="w-full text-left border-b-2 border-gray-100">
                                <thead className="border-b-2 border-t-2 border-gray-100">
                                    <tr>
                                        <th className="py-3 text-sm font-bold text-[#1a1a2e]">Description</th>
                                        <th className="py-3 text-sm font-bold text-center text-[#1a1a2e]">Qty</th>
                                        <th className="py-3 text-sm font-bold text-right text-[#1a1a2e]">Price</th>
                                        <th className="py-3 text-sm font-bold text-right text-[#1a1a2e]">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {invoice.items.map((item: any, i: number) => (
                                        <tr key={i}>
                                            <td className="py-4 text-sm text-gray-500">{item.description}</td>
                                            <td className="py-4 text-sm text-center text-gray-500">{item.quantity}</td>
                                            <td className="py-4 text-sm text-right text-gray-500">Rs. {item.price}</td>
                                            <td className="py-4 text-sm font-medium text-right text-gray-500">Rs. {item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-end pt-6 border-t">
                                <div className="w-full md:w-64 space-y-3">
                                    <div className="flex justify-between text-sm border-b pb-2 mb-2 border-gray-100">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-medium text-gray-500">Rs. {invoice.subtotal}</span>
                                    </div>
                                    {invoice.tax > 0 && (
                                        <div className="flex justify-between text-sm border-b pb-2 mb-2 border-gray-100">
                                            <span className="text-gray-500">Tax ({invoice.tax}%)</span>
                                            <span className="font-medium text-gray-500">Rs. {((invoice.subtotal * invoice.tax) / 100).toFixed(2)}</span>
                                        </div>
                                    )}
                                    {invoice.discount > 0 && (
                                        <div className="flex justify-between text-sm border-b pb-2 mb-2 text-gray-500 border-gray-100">
                                            <span>Discount ({invoice.discount}%)</span>
                                            <span className="font-medium text-red-500">-Rs. {((invoice.subtotal * invoice.discount) / 100).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm border-b pb-2 mb-2 border-gray-100">
                                        <span className="text-gray-500">Amount Paid</span>
                                        <span className="font-medium text-green-600">Rs. {invoice.paidAmount || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm pb-2 border-b mb-0 border-gray-100">
                                        <span className="text-red-500">Balance Due</span>
                                        <span className="font-bold text-red-600">Rs. {Math.max(0, invoice.grandTotal - (invoice.paidAmount || 0))}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 pb-2 border-t-2 border-b-2 border-gray-900">
                                        <span className="text-base font-bold text-gray-900">Total Amount</span>
                                        <span className="text-xl font-bold text-royal-blue">Rs. {invoice.grandTotal}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link href={`/admin/invoices/${id}/edit`} className="block">
                                <Button variant="primary" className="w-full justify-start bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100">
                                    <Printer className="w-4 h-4 mr-3" /> Edit / Update Fields
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-[#1a1a2e] text-white p-6 rounded-xl shadow-sm space-y-6">
                        <h3 className="text-lg font-bold border-b border-gray-700 pb-3">Timeline</h3>
                        <div className="space-y-6">
                            <div className="relative pl-6 border-l border-gray-700 space-y-1">
                                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#c5a059]"></div>
                                <p className="text-xs text-gray-400 font-semibold uppercase">Created</p>
                                <p className="text-sm">{format(new Date(invoice.createdAt), "dd MMM yyyy, hh:mm a")}</p>
                            </div>
                            <div className="relative pl-6 border-l border-gray-700 space-y-1">
                                <div className={cn(
                                    "absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full",
                                    invoice.status === "Paid" ? "bg-green-500" : "bg-red-500"
                                )}></div>
                                <p className="text-xs text-gray-400 font-semibold uppercase">Due Date</p>
                                <p className="text-sm">{format(new Date(invoice.dueDate), "dd MMM yyyy")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
