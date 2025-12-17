// src/components/admin/OrderDetailsModal.tsx
"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Bike, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BASE_URL = "https://app.flowerstalk.org/v1";

interface Item {
    itemId: {
        _id: string;
        name: string;
        price: number;
        imageUrl: string;
    };
    quantity: number;
    _id: string;
}

interface Rider {
    _id: string;
    firstName: string;
    lastName: string;
    isAvailable: string;
    phoneNumber: string;
    email: string;
    status?: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    deliveryData: {
        senderName: string;
        receiversName: string;
        senderPhone: string;
        receiversPhone: string;
        deliveryAddress: string;
    };
    status: string;
    totalAmount: number;
    items: Item[];
    deliveryFee: number;
    tax: number;
    riderId?: string;
}

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
    onAssign: () => void;
    token: string;
    onUpdate: () => void;
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-sm text-slate-800 font-medium">{value}</p>
    </div>
);

const getStatusBadgeColor = (status: string) => {
    switch (status) {
        case "completed":
            return "bg-emerald-100 text-emerald-700";
        case "assigned":
            return "bg-blue-100 text-blue-700";
        case "pending":
            return "bg-yellow-100 text-yellow-700";
        case "accepted":
            return "bg-indigo-100 text-indigo-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

export default function OrderDetailsModal({ order, onClose, onAssign, token, onUpdate }: OrderDetailsModalProps) {
    const subtotal = order.totalAmount - order.deliveryFee - order.tax;
    const [riders, setRiders] = useState<Rider[]>([]);
    const [selectedRider, setSelectedRider] = useState("");
    const [action, setAction] = useState<"accept" | "assign" | null>(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const [assignedRiderDetails, setAssignedRiderDetails] = useState<Rider | null>(null);

    useEffect(() => {
        const fetchRiders = async () => {
            if (!token) return;

            try {
                const response = await fetch(`${BASE_URL}/dashboard/list-riders?limit=100`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (data.status && data.data) {
                    const availableRiders = data.data.filter(
                        (r: Rider) => r.isAvailable === "available" && r.status === "APPROVED"
                    );
                    setRiders(availableRiders);
                }
            } catch (error) {
                console.error("Failed to fetch riders:", error);
                toast.error("Failed to load available riders.");
            }
        };

        const findAssignedRiderDetails = async () => {
            if (!token || !order.riderId) {
                setAssignedRiderDetails(null);
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/dashboard/list-riders?limit=1000`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (data.status && Array.isArray(data.data)) {
                    const foundRider = data.data.find((r: Rider) => r._id === order.riderId);
                    setAssignedRiderDetails(foundRider || null);
                }
            } catch (error) {
                console.error("Failed to fetch assigned rider details:", error);
            }
        };

        if (order.status === "accepted") {
            fetchRiders();
        }

        if (order.riderId) {
            findAssignedRiderDetails();
        } else {
            setAssignedRiderDetails(null);
        }
    }, [order.status, order.riderId, token]);

    // UPDATED FUNCTION HERE
    const handleUpdateStatus = async (newStatus: "accepted" | "assigned") => {
        if (newStatus === "assigned" && !selectedRider) {
            toast.error("Please select a rider to assign.");
            return;
        }

        setIsAssigning(true);
        setAction(newStatus === "assigned" ? "assign" : "accept");

        let url = "";
        const method = "POST"; // Both endpoints are POST
        let body: any = {};

        // 1. CONFIGURING FOR ACCEPT ORDER
        if (newStatus === "accepted") {
            url = `${BASE_URL}/orders/accept-order`;
            body = {
                orderId: order._id,
                status: "accepted"
            };
        } 
        // 2. CONFIGURING FOR ASSIGN RIDER
        else if (newStatus === "assigned") {
            url = `${BASE_URL}/orders/assign-order-rider`;
            body = {
                orderId: order._id,
                riderId: selectedRider
            };
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();
            
            // Check for success (Assuming API returns status: true or success: true)
            if (response.ok && (result.status === true || result.success === true)) {
                if (newStatus === "accepted") {
                    toast.success("Order accepted successfully!");
                } else {
                    toast.success("Rider assigned successfully!");
                }
                onUpdate(); // Refresh parent
                onClose();  // Close modal
            } else {
                const errorMessage = result.message || "Operation failed.";
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error(error);
            toast.error((error as Error).message || "An unexpected error occurred");
        } finally {
            setIsAssigning(false);
            setAction(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-50 duration-300">
            <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="sticky top-0 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Order Details</h2>
                        <p className="font-mono text-sm text-rose-600">{order.orderNumber}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <X size={24} />
                    </button>
                </div>

                {/* Details */}
                <div className="p-6 space-y-6">
                    {/* Status & Customer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem
                            label="Order Status"
                            value={
                                <span
                                    className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadgeColor(order.status)}`}
                                >
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            }
                        />
                        <DetailItem label="Customer" value={order.deliveryData.senderName} />
                    </div>

                    {/* Receiver & Address */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                        <h3 className="text-sm font-semibold text-slate-800">Recipient Information</h3>
                        <DetailItem label="Name" value={order.deliveryData.receiversName} />
                        <DetailItem label="Phone" value={order.deliveryData.receiversPhone} />
                        <DetailItem label="Delivery Address" value={order.deliveryData.deliveryAddress} />
                    </div>

                    {/* Riders Details - Always show if assigned */}
                    {(order.status === "assigned" || order.status === "completed") && assignedRiderDetails && (
                        <div className="pt-6 border-t border-slate-200">
                            <h3 className="text-sm font-semibold text-slate-800 mb-3">Assigned Rider</h3>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        {assignedRiderDetails.firstName} {assignedRiderDetails.lastName}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {assignedRiderDetails.phoneNumber}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-2">Items Ordered</h3>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item._id} className="flex items-center gap-4 p-2 rounded-lg bg-slate-50">
                                    <img
                                        src={item.itemId.imageUrl}
                                        alt={item.itemId.name}
                                        className="w-12 h-12 rounded-md object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm text-slate-900">{item.itemId.name}</p>
                                        <p className="text-xs text-slate-500">
                                            {item.quantity} x ₦{item.itemId.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-sm text-slate-900">
                                        ₦{(item.quantity * item.itemId.price).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financials */}
                    <div className="pt-4 border-t border-slate-200 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <p className="text-slate-600">Subtotal</p>
                            <p className="font-medium text-slate-800">₦{subtotal.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <p className="text-slate-600">Delivery Fee</p>
                            <p className="font-medium text-slate-800">₦{order.deliveryFee.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <p className="text-slate-600">Tax</p>
                            <p className="font-medium text-slate-800">₦{order.tax.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-2">
                            <p className="font-bold text-base text-slate-900">Total</p>
                            <p className="font-bold text-lg text-rose-600">₦{order.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Action Buttons / Rider Assignment Section */}
                    {/* If status is PENDING -> Show Accept Button */}
                    {order.status === "pending" && (
                        <div className="pt-6 border-t border-slate-200">
                            <h3 className="text-sm font-semibold text-slate-800 mb-3">Actions</h3>
                            <Button
                                onClick={() => handleUpdateStatus("accepted")}
                                disabled={isAssigning}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isAssigning && action === "accept" ? <Loader2 size={18} className="animate-spin" /> : "Accept Order"}
                            </Button>
                        </div>
                    )}

                    {/* If status is ACCEPTED -> Show Assign Rider dropdown */}
                    {order.status === "accepted" && (
                        <div className="pt-6 border-t border-slate-200">
                            <h3 className="text-sm font-semibold text-slate-800 mb-3">Assign Rider</h3>
                            {riders.length > 0 ? (
                                <div className="flex gap-3">
                                    <select
                                        value={selectedRider}
                                        onChange={(e) => setSelectedRider(e.target.value)}
                                        className="flex-1 w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-rose-500/50"
                                        disabled={isAssigning}
                                    >
                                        <option value="">Select an available rider</option>
                                        {riders.map((rider) => (
                                            <option key={rider._id} value={rider._id}>
                                                {rider.firstName} {rider.lastName}
                                            </option>
                                        ))}
                                    </select>
                                    <Button
                                        onClick={() => handleUpdateStatus("assigned")}
                                        disabled={!selectedRider || isAssigning}
                                        className="bg-rose-600 hover:bg-rose-700 text-white"
                                    >
                                        {isAssigning && action === "assign" ? <Loader2 size={18} className="animate-spin" /> : <Bike size={18} />}
                                        <span className="ml-2 hidden sm:inline">Assign</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center text-sm text-slate-500 bg-slate-100 p-4 rounded-lg">
                                    No riders are currently available for assignment.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}