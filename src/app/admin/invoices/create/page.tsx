"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { Button } from "@/components/ui/Button";

export default function CreateInvoicePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: any) => {
        try {
            setIsLoading(true);
            setError(null);

            const res = await fetch("/api/admin/invoices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create invoice");
            }

            // Redirect to the newly created invoice detail page
            router.push(`/admin/invoices/${data._id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/invoices">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-500" />
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-playfair">Create New Invoice</h1>
                    <p className="text-gray-500 text-sm">Fill in the details to generate a branded invoice.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <InvoiceForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
    );
}
