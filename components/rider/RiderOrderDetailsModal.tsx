// src/components/rider/RiderOrderDetailsModal.tsx

"use client"

import { useState } from 'react';
import { updateOrderStatus, RiderUpdatableStatus } from "@/lib/orderActions";
import { Order } from "@/hooks/useRiderOrdersData";
import { Button } from "@/components/ui/button"; 
import { Loader2, X } from 'lucide-react';

interface RiderOrderDetailsModalProps {
  order: Order;
  token: string;
  onClose: () => void;
  onUpdate: () => void; // To re-fetch orders after successful update
}

// NOTE: This component assumes it is rendered inside a dialog/modal wrapper.
export default function RiderOrderDetailsModal({ order, token, onClose, onUpdate }: RiderOrderDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define the status transitions relevant to the rider
  const statusTransitions: { [key in Order['status']]?: [string, RiderUpdatableStatus, string] } = {
    // Current Status: [Button Text, Next Status for API, Confirmation Message]
    "assigned": ["Accept Delivery", "rider_accept_order", "Do you confirm accepting this order?"],
    "rider_accept_order": ["Mark as Picked Up", "rider_pickedup", "Have you collected the item from the sender?"],
    "accepted": ["Mark as Picked Up", "rider_pickedup", "Have you collected the item from the sender?"],
    "rider_pickedup": ["Start Delivery", "in_progress", "Confirm item is now in transit to the recipient?"],
    "in_progress": ["Mark as Delivered", "completed", "Confirm successful delivery to the recipient?"],
  };

  const currentAction = statusTransitions[order.status];

  const handleStatusUpdate = async () => {
    if (!currentAction) return;

    if (!window.confirm(currentAction[2])) return;

    setLoading(true);
    setError(null);
    const success = await updateOrderStatus(order._id, currentAction[1], token);

    if (success) {
      onUpdate(); 
    } else {
      setError(`Failed to update status to ${currentAction[1].replace(/_/g, ' ')}. Please try again.`);
    }
    setLoading(false);
  };
  
  const formattedStatus = order.status.replace(/_/g, ' ');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-900">Order Ref: {order.reference}</h3>
          <Button onClick={onClose} size="icon" variant="ghost" className="text-gray-500 hover:text-gray-900">
            <X size={24} />
          </Button>
        </div>

        {/* Modal Body - Details */}
        <div className="p-6 space-y-4">
          <p className="text-sm font-semibold text-gray-700">
            Current Status: <span className={`capitalize font-bold ${currentAction ? 'text-blue-600' : 'text-emerald-600'}`}>{formattedStatus}</span>
          </p>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Recipient Information</h4>
            <p className="text-gray-700">
              **Name:** {order.deliveryData.receiversName}<br />
              **Phone:** {order.deliveryData.receiversPhone}<br />
              **Drop-off:** {order.deliveryData.deliveryAddress}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Items & Payment</h4>
            {order.items.map((item, index) => (
              <p key={index} className="text-sm text-gray-600">
                {item.quantity} x {item.itemId.name} (₦{(item.itemId.price * item.quantity).toLocaleString()})
              </p>
            ))}
            <p className="mt-2 font-bold text-lg text-rose-600">
              Total Amount: ₦{order.totalAmount.toLocaleString()}
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 border rounded-md">
            <p className="text-sm font-medium text-gray-700">Delivery Note: {order.deliveryData.note || "N/A"}</p>
          </div>
        </div>

        {/* Modal Footer - Actions */}
        <div className="p-6 border-t sticky bottom-0 bg-white">
          {error && <div className="p-2 bg-red-100 text-red-600 rounded-md text-sm mb-3">{error}</div>}

          {currentAction ? (
            <Button
              onClick={handleStatusUpdate}
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" /> Updating Status...
                </>
              ) : (
                currentAction[0]
              )}
            </Button>
          ) : (
            <p className="text-center text-gray-500 font-medium text-sm">This order is already complete or cancelled.</p>
          )}
        </div>
      </div>
    </div>
  );
}