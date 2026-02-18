"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import { InvoiceTable } from "@/components/admin/InvoiceTable";
import { Button } from "@/components/ui/Button";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [stats, setStats] = useState<any>(null);

    const fetchInvoices = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(
                `/api/admin/invoices?search=${searchTerm}&status=${statusFilter}`
            );
            const data = await res.json();
            setInvoices(data.invoices || []);
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats/invoices");
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    useEffect(() => {
        fetchInvoices();
        fetchStats();
    }, [searchTerm, statusFilter]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this invoice?")) return;
        try {
            const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchInvoices();
                fetchStats();
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-playfair">Invoice Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage, generate, and track customer invoices.</p>
                </div>
                <Link href="/admin/invoices/create">
                    <Button variant="primary" className="shadow-lg shadow-royal-blue/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Invoice
                    </Button>
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Revenue", value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, color: "bg-blue-50 text-blue-600" },
                    { label: "Paid", value: stats?.paidInvoices || 0, color: "bg-green-50 text-green-600" },
                    { label: "Unpaid", value: stats?.unpaidInvoices || 0, color: "bg-red-50 text-red-600" },
                    { label: "Partial", value: stats?.partialInvoices || 0, color: "bg-amber-50 text-amber-600" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                        <p className={`text-2xl font-bold mt-2 ${stat.color.split(' ')[1]}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by customer or invoice #..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#1a1a2e] focus:ring-2 focus:ring-royal-blue/20 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        className="flex-1 md:w-40 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#1a1a2e] outline-none cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Partial">Partial</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <InvoiceTable invoices={invoices} onDelete={handleDelete} />
        </div>
    );
}
