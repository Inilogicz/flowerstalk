"use client"

import { useState } from "react"
import { X, Loader2, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"

const BASE_URL = "https://app.flowerstalk.org/v1"

interface OrderDetailModalProps {
  order: any
  onClose: () => void
  onUpdate: () => void
  token: string
}

export default function OrderDetailModal({ order, onClose, onUpdate, token }: OrderDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedRiderId, setSelectedRiderId] = useState("")

  const handleAcceptOrder = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/orders/accept-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          status: "accepted",
        }),
      })
      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error("Accept failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignRider = async () => {
    if (!selectedRiderId) return
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/orders/assign-order-rider`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          riderId: selectedRiderId,
        }),
      })
      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error("Assign failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-50 duration-300">
      <div className="bg-white border border-gray-200 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Order Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Reference & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Reference</p>
              <p className="font-mono text-base sm:text-lg font-bold text-rose-600">{order.reference}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Status</p>
              <p className="text-base sm:text-lg font-bold capitalize text-gray-900">{order.status}</p>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Delivery Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div>
                <p className="text-gray-600 text-xs">Recipient</p>
                <p className="text-gray-900 font-medium">{order.deliveryData.receiversName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Phone</p>
                <p className="text-gray-900 font-medium">{order.deliveryData.receiversPhone}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Location</p>
                <p className="text-gray-900 font-medium">{order.deliveryData.location}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Address</p>
                <p className="text-gray-900 font-medium">{order.deliveryData.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Items</h3>
            <div className="space-y-2">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">
                    {item.itemId?.name || "Item"} × {item.quantity}
                  </span>
                  <span className="text-gray-900 font-medium">
                    ₦{((item.itemId?.price || 0) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Summary */}
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-gray-900">
                ₦{(order.totalAmount - order.deliveryFee - order.tax).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Delivery Fee</span>
              <span className="text-gray-900">₦{order.deliveryFee?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Tax</span>
              <span className="text-gray-900">₦{order.tax?.toLocaleString() || 0}</span>
            </div>
            <div className="border-t border-rose-200 pt-2 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-rose-600 text-base sm:text-lg">
                ₦{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 sm:space-y-3">
            {order.status === "pending" && (
              <Button
                onClick={handleAcceptOrder}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  "Accept Order"
                )}
              </Button>
            )}

            {order.status === "accepted" && (
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-900">Assign Rider</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Rider ID"
                    value={selectedRiderId}
                    onChange={(e) => setSelectedRiderId(e.target.value)}
                    className="flex-1 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-rose-500 text-sm"
                  />
                  <Button
                    onClick={handleAssignRider}
                    disabled={loading || !selectedRiderId}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Truck size={16} className="mr-1" />
                        Assign
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            <Button
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm sm:text-base"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
