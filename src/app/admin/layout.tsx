"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Users, LogOut, Menu, X, Scissors, Star } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            router.push("/admin/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Invoices", href: "/admin/invoices", icon: Scissors }, // Using Scissors as a placeholder for invoice or finding a better icon
        { name: "Contacts", href: "/admin/contacts", icon: Users },
        { name: "Reviews", href: "/admin/reviews", icon: Star },
    ];

    const isLoginPage = pathname === "/admin/login";

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile Sidebar Overlay */}
            {!isLoginPage && isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            {!isLoginPage && (
                <aside
                    className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#1a1a2e] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="flex items-center justify-center h-20 bg-[#2a2a4e]">
                        <Link href="/" className="flex items-center h-12">
                            <img
                                src="/images/website-logo.png"
                                alt="Tanwar Tailor"
                                className="h-full w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                    </div>

                    <nav className="mt-8 px-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                        ? "bg-[#c5a059] text-white"
                                        : "text-gray-400 hover:bg-[#2a2a4e] hover:text-white"
                                        }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <item.icon className="h-5 w-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-400 hover:bg-[#2a2a4e] hover:text-red-300 transition-colors duration-200 mt-8 cursor-pointer"
                        >
                            <LogOut className="h-5 w-5 mr-3" />
                            Logout
                        </button>
                    </nav>
                </aside>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex items-center justify-between h-20 bg-white px-6 shadow-sm border-b">
                    {!isLoginPage ? (
                        <button
                            className="text-gray-500 focus:outline-none lg:hidden"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    ) : (
                        <Link href="/" className="flex items-center gap-2 font-playfair">
                            <Scissors className="h-6 w-6 text-[#c5a059]" />
                            <h2 className="text-lg font-bold tracking-wider text-[#1a1a2e]">
                                Tanwar <span className="text-[#c5a059]">Tailor</span>
                            </h2>
                        </Link>
                    )}

                    <div className="flex items-center ml-auto">
                        <span className="text-sm text-gray-600 mr-2">Admin Panel</span>
                        <div className="h-8 w-8 rounded-full bg-[#c5a059] flex items-center justify-center text-white font-bold text-xs">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
