"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { isValidIndianMobile } from "@/lib/validation";

interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
    total: number;
}

interface InvoiceFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

export const InvoiceForm = ({ initialData, onSubmit, isLoading }: InvoiceFormProps) => {
    const [phoneError, setPhoneError] = useState("");
    const [formData, setFormData] = useState({
        customerName: initialData?.customerName || "",
        customerPhone: initialData?.customerPhone || "",
        customerEmail: initialData?.customerEmail || "",
        customerAddress: initialData?.customerAddress || "",
        items: initialData?.items || [
            { description: "", quantity: 1, price: 0, total: 0 },
        ],
        subtotal: initialData?.subtotal || 0,
        tax: initialData?.tax || 0,
        discount: initialData?.discount || 0,
        grandTotal: initialData?.grandTotal || 0,
        paidAmount: initialData?.paidAmount || 0,
        status: initialData?.status || "Unpaid",
        dueDate: initialData?.dueDate
            ? new Date(initialData.dueDate).toISOString().split("T")[0]
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
    });

    // Calculate totals whenever items, tax, or discount change
    useEffect(() => {
        const subtotal = formData.items.reduce((acc: number, item: InvoiceItem) => {
            return acc + (item.quantity * item.price);
        }, 0);

        const taxAmount = (subtotal * (formData.tax || 0)) / 100;
        const discountAmount = (subtotal * (formData.discount || 0)) / 100;
        const grandTotal = Math.round(subtotal + taxAmount - discountAmount);

        setFormData((prev) => {
            const updates: any = { subtotal, grandTotal };
            if (prev.status === "Paid") {
                updates.paidAmount = grandTotal;
            }
            return {
                ...prev,
                ...updates,
            };
        });
    }, [formData.items, formData.tax, formData.discount, formData.status]);

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [field]: value,
        };

        if (field === "quantity" || field === "price") {
            const qty = field === "quantity" ? Number(value) || 0 : Number(newItems[index].quantity) || 0;
            const price = field === "price" ? Number(value) || 0 : Number(newItems[index].price) || 0;
            newItems[index].total = qty * price;
        }

        setFormData((prev) => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData((prev) => ({
            ...prev,
            items: [...prev.items, { description: "", quantity: 1, price: 0, total: 0 }],
        }));
    };

    const removeItem = (index: number) => {
        if (formData.items.length === 1) return;
        const newItems = formData.items.filter((_: any, i: number) => i !== index);
        setFormData((prev) => ({ ...prev, items: newItems }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPhoneError("");

        if (!isValidIndianMobile(formData.customerPhone)) {
            setPhoneError("Please enter a valid Indian mobile number.");
            // Scroll to the error or focus input if needed
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Customer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Customer Name</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter customer name"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                            value={formData.customerName}
                            onChange={(e) =>
                                setFormData({ ...formData, customerName: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Customer Phone</label>
                        <input
                            type="tel"
                            required
                            placeholder="Enter customer phone"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                            value={formData.customerPhone}
                            onChange={(e) =>
                                setFormData({ ...formData, customerPhone: e.target.value })
                            }
                        />
                        {phoneError && (
                            <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Customer Email (Optional)</label>
                        <input
                            type="email"
                            placeholder="Enter customer email"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                            value={formData.customerEmail}
                            onChange={(e) =>
                                setFormData({ ...formData, customerEmail: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Due Date</label>
                        <input
                            type="date"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                            value={formData.dueDate}
                            onChange={(e) =>
                                setFormData({ ...formData, dueDate: e.target.value })
                            }
                        />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-sm font-medium text-gray-700">Customer Address</label>
                        <textarea
                            rows={2}
                            placeholder="Enter customer billing address"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] focus:ring-2 focus:ring-royal-blue/20 outline-none transition-all"
                            value={formData.customerAddress}
                            onChange={(e) =>
                                setFormData({ ...formData, customerAddress: e.target.value })
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Items Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={addItem}
                        className="text-xs py-1.5"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add Item
                    </Button>
                </div>
                <div className="space-y-3">
                    {formData.items.map((item: InvoiceItem, index: number) => (
                        <div key={index} className="grid grid-cols-12 gap-3 items-end group">
                            <div className="col-span-12 md:col-span-6 space-y-1">
                                {index === 0 && (
                                    <label className="text-xs font-medium text-gray-500 uppercase">
                                        Description
                                    </label>
                                )}
                                <input
                                    type="text"
                                    placeholder="Service or product description"
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] text-sm"
                                    value={item.description}
                                    onChange={(e) =>
                                        handleItemChange(index, "description", e.target.value)
                                    }
                                />
                            </div>
                            <div className="col-span-3 md:col-span-2 space-y-1">
                                {index === 0 && (
                                    <label className="text-xs font-medium text-gray-500 uppercase">
                                        Qty
                                    </label>
                                )}
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] text-sm text-center"
                                    value={item.quantity === 0 ? "" : item.quantity}
                                    onChange={(e) =>
                                        handleItemChange(index, "quantity", e.target.value === "" ? 0 : parseInt(e.target.value))
                                    }
                                />
                            </div>
                            <div className="col-span-4 md:col-span-2 space-y-1">
                                {index === 0 && (
                                    <label className="text-xs font-medium text-gray-500 uppercase">
                                        Price
                                    </label>
                                )}
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    placeholder="0.00"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] text-sm"
                                    value={item.price === 0 ? "" : item.price}
                                    onChange={(e) =>
                                        handleItemChange(index, "price", e.target.value === "" ? 0 : parseFloat(e.target.value))
                                    }
                                />
                            </div>
                            <div className="col-span-4 md:col-span-1 space-y-1">
                                {index === 0 && (
                                    <label className="text-xs font-medium text-gray-500 uppercase">
                                        Total
                                    </label>
                                )}
                                <div className="px-3 py-2 text-sm font-semibold text-gray-700">
                                    Rs. {item.total || 0}
                                </div>
                            </div>
                            <div className="col-span-1 text-right">
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Section */}
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        Invoice Status
                    </h3>
                    <div className="flex gap-4">
                        {["Unpaid", "Paid", "Partial"].map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => {
                                    const updates: any = { status };
                                    if (status === "Paid") {
                                        updates.paidAmount = formData.grandTotal;
                                    } else if (status === "Unpaid") {
                                        updates.paidAmount = 0;
                                    }
                                    setFormData({ ...formData, ...updates });
                                }}
                                className={cn(
                                    "flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all",
                                    formData.status === status
                                        ? "bg-royal-blue text-white border-royal-blue shadow-md"
                                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {(formData.status === "Partial" || formData.status === "Paid") && (
                        <div className="mt-4 pt-4 border-t space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                {formData.status === "Partial" ? "Advance Amount Paid" : "Total Amount Paid"}
                            </label>
                            <input
                                type="number"
                                placeholder="Enter amount paid"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] focus:ring-2 focus:ring-royal-blue/20 outline-none"
                                value={formData.paidAmount === 0 ? "" : formData.paidAmount}
                                onChange={(e) =>
                                    setFormData({ ...formData, paidAmount: parseFloat(e.target.value) || 0 })
                                }
                            />
                        </div>
                    )}
                </div>

                <div className="w-full md:w-80 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 text-right">
                        Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-semibold text-[#1a1a2e]">Rs. {formData.subtotal}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-gray-500 text-[#1a1a2e]">Tax (%)</span>
                            <input
                                type="number"
                                placeholder="0"
                                className="text-right border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-royal-blue text-[#1a1a2e]"
                                value={formData.tax === 0 ? "" : formData.tax}
                                onChange={(e) =>
                                    setFormData({ ...formData, tax: e.target.value === "" ? 0 : parseFloat(e.target.value) })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center">
                            <span className="text-gray-500">Discount (%)</span>
                            <input
                                type="number"
                                placeholder="0"
                                className="text-right border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-royal-blue text-[#1a1a2e]"
                                value={formData.discount === 0 ? "" : formData.discount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        discount: e.target.value === "" ? 0 : parseFloat(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div className="pt-4 border-t flex justify-between items-center">
                            <span className="text-base font-bold text-gray-900">Grand Total</span>
                            <span className="text-xl font-bold text-royal-blue">
                                Rs. {formData.grandTotal}
                            </span>
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full py-3 mt-4">
                        {isLoading ? "Saving..." : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Invoice
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
};
