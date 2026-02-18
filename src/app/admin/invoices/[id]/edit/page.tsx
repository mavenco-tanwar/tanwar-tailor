"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { Button } from "@/components/ui/Button";

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [invoice, setInvoice] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleSubmit = async (formData: any) => {
        try {
            setIsSaving(true);
            setError(null);

            const res = await fetch(`/api/admin/invoices/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update invoice");
            }

            router.push(`/admin/invoices/${id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading invoice...</div>;
    if (!invoice) return <div className="p-8 text-center text-red-500">Invoice not found.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/admin/invoices/${id}`}>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-500" />
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-playfair">Edit Invoice</h1>
                    <p className="text-gray-500 text-sm">Update details for invoice #{invoice.invoiceNumber}.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <InvoiceForm
                initialData={invoice}
                onSubmit={handleSubmit}
                isLoading={isSaving}
            />
        </div>
    );
}
