"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Search, Package, Truck, MapPin, CheckCircle } from "lucide-react"
import { getOrderByTrackingId } from "@/lib/orders"
import { useToast } from "@/hooks/use-toast"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed":
    case "processing":
      return <Package className="w-6 h-6" />
    case "dispatched":
    case "with-rider":
      return <Truck className="w-6 h-6" />
    case "available-for-pickup":
      return <MapPin className="w-6 h-6" />
    case "delivered":
      return <CheckCircle className="w-6 h-6" />
    default:
      return <Package className="w-6 h-6" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
    case "processing":
      return "bg-blue-100 text-blue-700"
    case "dispatched":
    case "with-rider":
      return "bg-orange-100 text-orange-700"
    case "available-for-pickup":
      return "bg-purple-100 text-purple-700"
    case "delivered":
      return "bg-green-100 text-green-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "confirmed":
      return "Order Confirmed"
    case "processing":
      return "Processing"
    case "dispatched":
      return "Dispatched"
    case "with-rider":
      return "With Rider"
    case "available-for-pickup":
      return "Available for Pickup"
    case "delivered":
      return "Delivered"
    default:
      return "Unknown"
  }
}

const getStatusSteps = (currentStatus: string) => {
  const steps = [
    { status: "confirmed", label: "Order Received", icon: CheckCircle },
    { status: "processing", label: "Processing", icon: Package },
    { status: "dispatched", label: "Dispatched", icon: Truck },
    { status: "with-rider", label: "With Rider", icon: Truck },
    { status: "available-for-pickup", label: "Ready for Pickup", icon: MapPin },
    { status: "delivered", label: "Delivered", icon: CheckCircle },
  ]

  const currentIndex = steps.findIndex((s) => s.status === currentStatus)
  return steps.map((step, index) => ({
    ...step,
    isCompleted: index <= currentIndex,
    isActive: index === currentIndex,
  }))
}

export default function TrackOrder() {
  const [trackingId, setTrackingId] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [searched, setSearched] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingId.trim()) {
      toast({
        title: "Please enter a tracking ID",
        variant: "destructive",
      })
      return
    }

    const foundOrder = getOrderByTrackingId(trackingId.toUpperCase())
    if (foundOrder) {
      setOrder(foundOrder)
      setSearched(true)
    } else {
      setOrder(null)
      setSearched(true)
      toast({
        title: "Order not found",
        description: "Please check your tracking ID and try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="flex flex-col w-full">
      <Header />

      {/* Page Title */}
      <section className="w-full bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Track Your Order</h1>
          <p className="text-muted-foreground">Enter your tracking ID to view order status</p>
        </div>
      </section>

      {/* Tracking Section */}
      <section className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your Tracking ID (e.g., FS12345678)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
              />
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2">
                <Search className="w-5 h-5" />
                Track
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Check your email for the tracking ID sent after order confirmation
            </p>
          </form>

          {/* Order Found */}
          {searched && order && (
            <div className="space-y-8">
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-xl font-bold text-foreground mb-8">Order Tracking</h2>

                {/* Timeline Steps */}
                <div className="space-y-6">
                  {getStatusSteps(order.status).map((step, index) => {
                    const Icon = step.icon
                    return (
                      <div key={step.status} className="flex gap-4">
                        {/* Timeline dot and line */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              step.isCompleted ? "bg-rose-600 text-white" : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          {index < 5 && (
                            <div className={`w-1 h-12 my-2 ${step.isCompleted ? "bg-rose-600" : "bg-gray-200"}`} />
                          )}
                        </div>

                        {/* Timeline content */}
                        <div className="flex-1 pt-2">
                          <p
                            className={`font-semibold ${
                              step.isCompleted ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                          {step.isActive && <p className="text-sm text-rose-600 font-medium mt-1">Current Status</p>}
                          {step.isCompleted && !step.isActive && (
                            <p className="text-xs text-muted-foreground mt-1">✓ Completed</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Status Badge and Basic Info */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tracking ID</p>
                    <p className="text-2xl font-bold text-foreground font-mono">{order.trackingId}</p>
                  </div>
                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-full ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                  </div>
                </div>

                <div className={`inline-block px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
                  <p className="font-semibold">{getStatusLabel(order.status)}</p>
                </div>
              </div>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full bg-rose-50 hover:bg-rose-100 border-2 border-rose-600 text-rose-600 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {showDetails ? "Hide Order Details" : "View Order Details"}
              </button>

              {showDetails && (
                <>
                  {/* Order Details */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-foreground mb-6">Order Details</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Customer Name</p>
                        <p className="font-semibold text-foreground">
                          {order.personalInfo.firstName} {order.personalInfo.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                        <p className="font-semibold text-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="font-semibold text-foreground">{order.personalInfo.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Phone</p>
                        <p className="font-semibold text-foreground">{order.personalInfo.phone}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="border-t border-border pt-6">
                      <p className="font-semibold text-foreground mb-4">Items in Order</p>
                      <div className="space-y-3">
                        {order.items.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center py-3 border-b border-border last:border-0"
                          >
                            <div>
                              <p className="font-medium text-foreground">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-foreground">
                              ₦{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      {order.deliveryMethod === "door-delivery" ? "Delivery Address" : "Pickup Information"}
                    </h2>

                    {order.deliveryMethod === "door-delivery" ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Full Address</p>
                          <div className="bg-secondary/50 p-4 rounded-lg space-y-1">
                            <p className="font-medium text-foreground">{order.deliveryDetails.address}</p>
                            <p className="text-sm text-foreground">
                              {order.deliveryDetails.city}, {order.deliveryDetails.state}{" "}
                              {order.deliveryDetails.zipCode}
                            </p>
                          </div>
                        </div>
                        {order.deliveryDetails.notes && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Delivery Notes</p>
                            <p className="bg-secondary/50 p-4 rounded-lg text-foreground">
                              {order.deliveryDetails.notes}
                            </p>
                          </div>
                        )}
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <p className="text-sm text-blue-700">
                            Your order will be delivered to the address above. Our rider will contact you before
                            arrival.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Pickup Location</p>
                          <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                            <p className="font-medium text-foreground">FlowerStalk Store</p>
                            <p className="text-sm text-foreground">123 Flower Street, Lagos</p>
                            <p className="text-sm text-foreground">Hours: 9:00 AM - 6:00 PM, Daily</p>
                          </div>
                        </div>
                        {order.pickupDetails?.notes && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Notes</p>
                            <p className="bg-secondary/50 p-4 rounded-lg text-foreground">
                              {order.pickupDetails.notes}
                            </p>
                          </div>
                        )}
                        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                          <p className="text-sm text-purple-700">
                            Your order is ready for pickup! Please bring your tracking ID when you visit.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Total */}
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>₦{order.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax</span>
                        <span>₦{order.tax.toLocaleString()}</span>
                      </div>
                      {order.deliveryFee > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Delivery Fee</span>
                          <span>₦{order.deliveryFee.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t border-border pt-3 flex justify-between items-center">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="text-2xl font-bold text-rose-600">₦{order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/">
                    <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white">Continue Shopping</Button>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Not Found Message */}
          {searched && !order && (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 rounded-full p-4">
                  <Package className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find an order with the tracking ID{" "}
                <span className="font-mono font-semibold">{trackingId}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Please check your email for the correct tracking ID. It should start with "FS" followed by 8 characters.
              </p>
              <Button
                onClick={() => {
                  setTrackingId("")
                  setSearched(false)
                  setOrder(null)
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Try Another ID
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
