"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Mail, Phone, Calendar, Trash2, CheckCircle, Circle, Loader2 } from "lucide-react";
import Link from "next/link";

interface Contact {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function ContactDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchContact(params.id as string);
        }
    }, [params.id]);

    const fetchContact = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/contacts/${id}`);
            if (res.ok) {
                const data = await res.json();
                setContact(data);
            } else {
                if (res.status === 401) router.push('/admin/login');
                else router.push('/admin/contacts');
            }
        } catch (error) {
            console.error("Error fetching contact:", error);
            router.push('/admin/contacts');
        } finally {
            setLoading(false);
        }
    };

    const toggleReadStatus = async () => {
        if (!contact) return;

        try {
            const res = await fetch(`/api/admin/contacts/${contact._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead: !contact.isRead }),
            });

            if (res.ok) {
                const updated = await res.json();
                setContact(updated);
            }
        } catch (error) {
            console.error("Error updating contact:", error);
        }
    };

    const handleDelete = async () => {
        if (!contact) return;
        if (!confirm("Are you sure you want to delete this query? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/contacts/${contact._id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push('/admin/contacts');
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-[#c5a059]" />
            </div>
        );
    }

    if (!contact) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Contact not found</p>
                <Link href="/admin/contacts" className="text-[#c5a059] hover:underline mt-4 inline-block">
                    Back to Contacts
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/contacts"
                    className="flex items-center text-gray-600 hover:text-[#c5a059] transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Contacts
                </Link>

                <div className="flex gap-3">
                    <button
                        onClick={toggleReadStatus}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${contact.isRead
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-[#c5a059] text-white hover:bg-[#b39050]'
                            }`}
                    >
                        {contact.isRead ? (
                            <>
                                <Circle className="w-4 h-4 mr-2" />
                                Mark as Unread
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Read
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleDelete}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#1a1a2e] p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="h-16 w-16 rounded-full bg-[#c5a059] text-white flex items-center justify-center font-bold text-2xl">
                                {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                                <h1 className="text-2xl font-bold text-white">{contact.name}</h1>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-2 ${contact.isRead
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                >
                                    {contact.isRead ? 'Read' : 'Unread'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start space-x-3">
                            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <a href={`mailto:${contact.email}`} className="text-[#c5a059] hover:underline font-medium">
                                    {contact.email}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <a href={`tel:${contact.phone}`} className="text-[#c5a059] hover:underline font-medium">
                                    {contact.phone}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Submitted</p>
                                <p className="font-medium text-gray-900">
                                    {format(new Date(contact.createdAt), 'MMM dd, yyyy - h:mm a')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Message</h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{contact.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
