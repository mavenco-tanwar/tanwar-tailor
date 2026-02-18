"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    Wallet,
    Banknote,
    ArrowUpRight,
    MessageSquare,
    Mail,
    Plus,
    FileText,
    History
} from "lucide-react";

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

            {/* Premium Financial Summary Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center">
                            <Banknote className="w-4 h-4 mr-2 text-royal-blue" />
                            Financial Performance
                        </h3>
                        <span className="text-[10px] font-bold bg-blue-50 text-royal-blue px-2 py-1 rounded-full uppercase">Real-time</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-8 border-r border-gray-50">
                            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Total Collected</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-gray-900 leading-none">
                                    {loading ? "--" : `Rs. ${invoiceStats.totalRevenue.toLocaleString()}`}
                                </span>
                                <div className="flex items-center text-green-500 text-xs font-bold">
                                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                                    Active
                                </div>
                            </div>
                            <p className="text-gray-400 text-[10px] mt-4 font-medium uppercase tracking-tighter">
                                From {invoiceStats.paidInvoices + invoiceStats.partialInvoices} successful transactions
                            </p>
                        </div>
                        <div className="p-8 flex flex-col justify-center">
                            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Remaining Balance</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-red-500 leading-none">
                                    {loading ? "--" : `Rs. ${invoiceStats.pendingAmount.toLocaleString()}`}
                                </span>
                            </div>
                            <p className="text-gray-400 text-[10px] mt-4 font-medium uppercase tracking-tighter">
                                Pending across {invoiceStats.unpaidInvoices + invoiceStats.partialInvoices} invoices
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center">
                            <History className="w-4 h-4 mr-2 text-amber-500" />
                            Invoice Status
                        </h3>
                        <Link href="/admin/invoices" className="text-royal-blue hover:text-blue-800 text-[10px] font-black uppercase tracking-widest">
                            View All
                        </Link>
                    </div>

                    <div className="space-y-4 flex-1 flex flex-col justify-center">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-green-50/50 border border-green-100/50">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white mr-3 shadow-sm shadow-green-200">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Fully Paid</p>
                                    <p className="text-[10px] text-gray-500">Payments settled</p>
                                </div>
                            </div>
                            <span className="text-xl font-black text-green-600">{loading ? "--" : invoiceStats.paidInvoices}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 border border-red-100/50">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white mr-3 shadow-sm shadow-red-200">
                                    <AlertCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Unpaid</p>
                                    <p className="text-[10px] text-gray-500">Zero payment</p>
                                </div>
                            </div>
                            <span className="text-xl font-black text-red-600">{loading ? "--" : invoiceStats.unpaidInvoices}</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100/50">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white mr-3 shadow-sm shadow-amber-200">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Partial</p>
                                    <p className="text-[10px] text-gray-500">Advance paid</p>
                                </div>
                            </div>
                            <span className="text-xl font-black text-amber-600">{loading ? "--" : invoiceStats.partialInvoices}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Queries and Actions Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-xl bg-royal-blue/10 flex items-center justify-center text-royal-blue mr-3">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <h3 className="text-gray-900 text-sm font-bold uppercase tracking-wider">Total Queries</h3>
                    </div>
                    <p className="text-4xl font-black text-gray-900">
                        {loading ? "--" : stats.totalContacts}
                    </p>
                    <div className="flex items-center mt-2">
                        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                            {loading ? "..." : `+${stats.todayContacts} new today`}
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 mr-3">
                                <Mail className="w-5 h-5" />
                            </div>
                            <h3 className="text-gray-900 text-sm font-bold uppercase tracking-wider">Unread</h3>
                        </div>
                        {stats.unreadContacts > 0 && (
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                        )}
                    </div>
                    <p className="text-4xl font-black text-gray-900">
                        {loading ? "--" : stats.unreadContacts}
                    </p>
                    <p className="text-xs font-medium text-gray-400 mt-2 uppercase tracking-tight">
                        {stats.unreadContacts > 0 ? "Immediate response needed" : "Inbox is perfectly clean"}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center">
                        <Plus className="w-4 h-4 mr-2 text-royal-blue" />
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/admin/invoices/create" className="w-full">
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-royal-blue text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                <FileText className="w-3 h-3" />
                                Invoice
                            </button>
                        </Link>
                        <Link href="/admin/contacts" className="w-full">
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-900 border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                                <MessageSquare className="w-3 h-3" />
                                Inbox
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
