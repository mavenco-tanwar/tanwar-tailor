import { format } from "date-fns";
import { Eye, Edit2, Trash2, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/Button";

interface Invoice {
    _id: string;
    invoiceNumber: string;
    customerName: string;
    customerPhone: string;
    grandTotal: number;
    paidAmount: number;
    status: "Paid" | "Unpaid" | "Partial";
    dueDate: string;
    createdAt: string;
}

interface InvoiceTableProps {
    invoices: Invoice[];
    onDelete: (id: string) => void;
}

export const InvoiceTable = ({ invoices, onDelete }: InvoiceTableProps) => {
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Invoice #
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Customer
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Total
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Paid
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Balance
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Due Date
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {invoices.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                No invoices found.
                            </td>
                        </tr>
                    ) : (
                        invoices.map((invoice) => (
                            <tr key={invoice._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-900">
                                        {invoice.invoiceNumber}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">
                                            {invoice.customerName}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {invoice.customerPhone}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-[#1a1a2e]">
                                    Rs. {invoice.grandTotal.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-green-600 font-medium">
                                    Rs. {invoice.paidAmount?.toLocaleString() || 0}
                                </td>
                                <td className="px-6 py-4 text-sm text-red-600 font-medium">
                                    Rs. {Math.max(0, invoice.grandTotal - (invoice.paidAmount || 0)).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={invoice.status} />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {format(new Date(invoice.dueDate), "dd MMM yyyy")}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link href={`/admin/invoices/${invoice._id}`}>
                                        <button className="p-2 text-gray-400 hover:text-royal-blue transition-colors cursor-pointer">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </Link>
                                    <Link href={`/admin/invoices/${invoice._id}/edit`}>
                                        <button className="p-2 text-gray-400 hover:text-amber-500 transition-colors cursor-pointer">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => onDelete(invoice._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
