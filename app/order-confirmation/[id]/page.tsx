"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check, Copy, Mail } from "lucide-react"
import { getOrderByTrackingId, type Order } from "@/lib/orders"
import { useToast } from "@/hooks/use-toast"

export default function OrderConfirmation() {
  const params = useParams()
  const trackingId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const foundOrder = getOrderByTrackingId(trackingId)
    setOrder(foundOrder)
  }, [trackingId])

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(trackingId)
    setCopied(true)
    toast({
      title: "Tracking ID copied!",
      description: "You can now use this to track your order.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  if (!order) {
    return (
      <main className="flex flex-col w-full min-h-screen">
        <Header />
        <section className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Order not found</p>
            <Link href="/">
              <Button className="bg-rose-600 hover:bg-rose-700 text-white">Back to Home</Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="flex flex-col w-full">
      <Header />

      {/* Success Section */}
      <section className="w-full bg-gradient-to-b from-green-50 to-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-500 rounded-full p-4">
              <Check className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your order. Your flowers will be prepared with care.
          </p>

          {/* Tracking ID Card */}
          <div className="bg-card border-2 border-rose-200 rounded-2xl p-8 mb-8">
            <p className="text-sm text-muted-foreground mb-2">Your Tracking ID</p>
            <div className="flex items-center justify-center gap-4 mb-2">
              <p className="text-3xl font-bold text-rose-600 font-mono">{trackingId}</p>
              <button
                onClick={handleCopyTracking}
                className="p-2 hover:bg-secondary rounded-lg transition"
                title="Copy tracking ID"
              >
                <Copy className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Save this ID to track your order</p>

            {/* Email Notification */}
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <Mail className="w-4 h-4" />
              <span>Tracking ID sent to {order.personalInfo.email}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Order Details */}
      <section className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Order Info */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Order Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-semibold text-foreground">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-semibold text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p className="font-semibold text-foreground">
                  {new Date(order.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold text-green-600 capitalize">{order.status}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-foreground">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {order.deliveryMethod === "door-delivery" ? "Delivery Address" : "Pickup Details"}
            </h2>
            {order.deliveryMethod === "door-delivery" ? (
              <div className="space-y-2 text-foreground">
                <p>
                  {order.personalInfo.firstName} {order.personalInfo.lastName}
                </p>
                <p>{order.deliveryDetails.address}</p>
                <p>
                  {order.deliveryDetails.city}, {order.deliveryDetails.state} {order.deliveryDetails.zipCode}
                </p>
                {order.deliveryDetails.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Delivery Notes</p>
                    <p className="text-foreground">{order.deliveryDetails.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 text-foreground">
                <p className="font-semibold">123 Flower Street, Lagos</p>
                <p className="text-sm text-muted-foreground">Open: 9:00 AM - 6:00 PM, Daily</p>
                {order.pickupDetails?.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-foreground">{order.pickupDetails.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Total */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">₦{order.tax.toLocaleString()}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">₦{order.deliveryFee.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-rose-600">₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/track" className="flex-1">
              <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white">Track Order</Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
