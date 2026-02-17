"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
    totalContacts: number;
    unreadContacts: number;
    todayContacts: number;
    systemStatus: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalContacts: 0,
        unreadContacts: 0,
        todayContacts: 0,
        systemStatus: "loading",
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
            const response = await fetch("/api/admin/stats");
            if (response.ok) {
                const data = await response.json();
                setStats(data);
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Queries</h3>
                    <p className="text-3xl font-bold text-[#1a1a2e] mt-2">
                        {loading ? "--" : stats.totalContacts}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                        {loading ? "Loading..." : `+${stats.todayContacts} today`}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Unread Messages</h3>
                    <p className="text-3xl font-bold text-[#c5a059] mt-2">
                        {loading ? "--" : stats.unreadContacts}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {stats.unreadContacts > 0 ? "Requires attention" : "All caught up!"}
                    </p>
                </div>

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
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Quick Actions</h3>
                <div className="space-y-2">
                    <p className="text-gray-500">
                        Select "Contacts" from the sidebar to view and manage customer queries.
                    </p>
                    {stats.unreadContacts > 0 && (
                        <p className="text-sm text-[#c5a059] font-medium">
                            ⚠️ You have {stats.unreadContacts} unread message
                            {stats.unreadContacts !== 1 ? "s" : ""} waiting for review.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
