"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
    totalContacts: number;
    unreadContacts: number;
    todayContacts: number;
    systemStatus: string;
}

interface InvoiceStats {
    totalRevenue: number;
    paidInvoices: number;
    unpaidInvoices: number;
    partialInvoices: number;
    pendingAmount: number;
    totalInvoices: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalContacts: 0,
        unreadContacts: 0,
        todayContacts: 0,
        systemStatus: "loading",
    });
    const [invoiceStats, setInvoiceStats] = useState<InvoiceStats>({
        totalRevenue: 0,
        paidInvoices: 0,
        unpaidInvoices: 0,
        partialInvoices: 0,
        pendingAmount: 0,
        totalInvoices: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        // Refresh stats every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const [contactsRes, invoicesRes] = await Promise.all([
                fetch("/api/admin/stats"),
                fetch("/api/admin/stats/invoices")
            ]);

            if (contactsRes.ok) {
                const data = await contactsRes.json();
                setStats(data);
            }
            if (invoicesRes.ok) {
                const data = await invoicesRes.json();
                setInvoiceStats(data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Queries</h3>
                    <p className="text-3xl font-bold text-[#1a1a2e] mt-2">
                        {loading ? "--" : stats.totalContacts}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                        {loading ? "Loading..." : `+${stats.todayContacts} today`}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Unread Messages</h3>
                    <p className="text-3xl font-bold text-[#c5a059] mt-2">
                        {loading ? "--" : stats.unreadContacts}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {stats.unreadContacts > 0 ? "Requires attention" : "All caught up!"}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Collected</h3>
                    <p className="text-3xl font-bold text-royal-blue mt-2">
                        {loading ? "--" : `Rs. ${invoiceStats.totalRevenue.toLocaleString()}`}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                        From {invoiceStats.paidInvoices + invoiceStats.partialInvoices} payments
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Remaining Balance</h3>
                    <p className="text-3xl font-bold text-red-500 mt-2">
                        {loading ? "--" : `Rs. ${invoiceStats.pendingAmount.toLocaleString()}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Pending from {invoiceStats.unpaidInvoices + invoiceStats.partialInvoices} invoices
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md">
                    <div>
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Fully Paid</h3>
                        <p className="text-2xl font-bold text-green-600 mt-1">{loading ? "--" : invoiceStats.paidInvoices}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold">100%</div>
                </div>

                <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md">
                    <div>
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Unpaid (Zero)</h3>
                        <p className="text-2xl font-bold text-red-500 mt-1">{loading ? "--" : invoiceStats.unpaidInvoices}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 font-bold">0%</div>
                </div>

                <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md">
                    <div>
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Partial Payment</h3>
                        <p className="text-2xl font-bold text-amber-500 mt-1">{loading ? "--" : invoiceStats.partialInvoices}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 font-bold">&gt;0%</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">System Status</h3>
                    <div className="flex items-center mt-2">
                        <span
                            className={`h-3 w-3 rounded-full mr-2 ${stats.systemStatus === "active"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                                }`}
                        ></span>
                        <p className="text-lg font-bold text-[#1a1a2e]">
                            {loading
                                ? "Checking..."
                                : stats.systemStatus === "active"
                                    ? "Active"
                                    : "Loading"}
                        </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        {stats.systemStatus === "active"
                            ? "System operational"
                            : "Connecting..."}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/admin/invoices/create">
                            <button className="px-4 py-2 bg-royal-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                Create Invoice
                            </button>
                        </Link>
                        <Link href="/admin/contacts">
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                                View Contacts
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
