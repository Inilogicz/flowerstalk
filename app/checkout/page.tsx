"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin, Home } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { generateTrackingId, saveOrder } from "@/lib/orders"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { Location, LocationsApiResponse } from "./types"

export default function Checkout() {
  const [step, setStep] = useState(1)
  const [deliveryMethod, setDeliveryMethod] = useState<"door-delivery" | "pickup">("door-delivery")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
    deliveryNotes: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const [locations, setLocations] = useState<Location[]>([])
  const [locationsLoading, setLocationsLoading] = useState(true)

  const { cartItems, subtotal, tax, total, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLocationsLoading(true)
        const response = await fetch("https://app.flowerstalk.org/v1/locations")
        if (!response.ok) {
          throw new Error("Failed to fetch locations")
        }
        const data: LocationsApiResponse = await response.json()
        if (data.status && Array.isArray(data.data)) {
          setLocations(data.data)
        } else {
          throw new Error(data.message || "Invalid data format")
        }
      } catch (error) {
        console.error("Error fetching locations:", error)
        toast({ title: "Could not load delivery locations", variant: "destructive" })
      } finally {
        setLocationsLoading(false)
      }
    }
    fetchLocations()
  }, [toast])

  const deliveryFee = locations.find((loc) => loc.location === formData.city)?.amount || 0
  const totalWithDelivery = subtotal + tax + (deliveryMethod === "door-delivery" ? deliveryFee : 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 3) {
      setStep(step + 1)
      return
    }
  
    setIsSubmitting(true)
  
    // Validate cart is not empty
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }
  
    const selectedLocation = locations.find((loc) => loc.location === formData.city)
  
    const orderPayload = {
      items: cartItems.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
      })),
      deliveryType: deliveryMethod === "door-delivery" ? "delivery" : "pickup",
      locationId: selectedLocation?._id,
      ...(deliveryMethod === "door-delivery" && {
        deliveryData: {
          senderName: `${formData.firstName} ${formData.lastName}`,
          senderPhone: formData.phone,
          senderEmail: formData.email,
          receiversName: `${formData.firstName} ${formData.lastName}`, // Assuming sender is receiver for now
          receiversPhone: formData.phone,
          location: formData.city,
          deliveryDate: new Date().toISOString(),
          deliveryAddress: formData.address,
          note: formData.deliveryNotes,
        },
      }),
      ...(deliveryMethod === "pickup" && {
        pickupData: {
          fullname: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          email: formData.email,
          pickupName: `${formData.firstName} ${formData.lastName}`, // Assuming sender is receiver
          pickupPhone: formData.phone,
          pickupDate: new Date().toISOString(),
          pickupAddress: "123 Flower Street, Lagos", // Hardcoded pickup address
          note: formData.notes,
        },
      }),
    }
  
    try {
      // API validation check
      if (deliveryMethod === "door-delivery" && !selectedLocation) {
        toast({ title: "Please select a delivery city.", variant: "destructive" })
        setIsSubmitting(false)
        return
      }
      const response = await fetch("https://app.flowerstalk.org/v1/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })
  
      const result = await response.json()
  
      if (!response.ok || !result.status) {
        throw new Error(result.message || "Failed to create order.")
      }
  
      if (result.paymentLink) {
        clearCart()
        window.location.href = result.paymentLink // Redirect to Paystack
      } else {
        throw new Error("Payment link not received.")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <main className="flex flex-col w-full">
      <Header />

      {/* Page Title */}
      <section className="w-full bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/cart" className="flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-4 w-fit">
            <ChevronLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Checkout</h1>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s <= step ? "bg-rose-600 text-white" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 ${
                      s < step ? "bg-rose-600" : "bg-secondary"
                    } transition-colors duration-300`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Personal Details</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                      />
                    </div>

                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address (Tracking info will be sent here)"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Method */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Delivery Method</h2>
                  <div className="space-y-4 mb-8">
                    {/* Door Delivery Option */}
                    <label
                      className="flex items-start p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-secondary transition"
                      style={{ borderColor: deliveryMethod === "door-delivery" ? "rgb(225, 29, 72)" : undefined }}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="door-delivery"
                        checked={deliveryMethod === "door-delivery"}
                        onChange={(e) => setDeliveryMethod(e.target.value as "door-delivery" | "pickup")}
                        className="mt-1 mr-4"
                        required
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          <Home className="w-4 h-4" /> Door Delivery
                        </p>
                        <p className="text-sm text-muted-foreground">Delivery to your doorstep</p>
                      </div>
                    </label>

                    {/* Store Pickup Option */}
                    <label
                      className="flex items-start p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-secondary transition"
                      style={{ borderColor: deliveryMethod === "pickup" ? "rgb(225, 29, 72)" : undefined }}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="pickup"
                        checked={deliveryMethod === "pickup"}
                        onChange={(e) => setDeliveryMethod(e.target.value as "door-delivery" | "pickup")}
                        className="mt-1 mr-4"
                        required
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Store Pickup
                        </p>
                        <p className="text-sm text-muted-foreground">Pick up from our store</p>
                      </div>
                    </label>
                  </div>

                  {/* Conditional Fields */}
                  {deliveryMethod === "door-delivery" && (
                    <div className="space-y-4 bg-secondary/50 p-6 rounded-lg">
                      <h3 className="font-semibold text-foreground mb-4">Delivery Details</h3>
                      <input
                        type="text"
                        name="address"
                        placeholder="Street Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                      />

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {locationsLoading ? (
                          <Skeleton className="h-[50px] w-full rounded-lg" />
                        ) : (
                          <select
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                          >
                            <option value="">Select City</option>
                            {locations.map((loc) => (
                              <option key={loc._id} value={loc.location}>
                                {loc.location}
                              </option>
                            ))}
                          </select>
                        )}
                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                        />
                        <input
                          type="text"
                          name="zipCode"
                          placeholder="ZIP Code"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                        />
                      </div>

                      <textarea
                        name="deliveryNotes"
                        placeholder="Delivery notes (optional) - e.g., Gate code, building details"
                        value={formData.deliveryNotes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                      />
                    </div>
                  )}

                  {deliveryMethod === "pickup" && (
                    <div className="space-y-4 bg-secondary/50 p-6 rounded-lg">
                      <h3 className="font-semibold text-foreground mb-4">Pickup Details</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Available for pickup at: 123 Flower Street, Lagos
                  </p>                  
                      <textarea
                        name="notes"
                        placeholder="Special notes (optional)"
                    value={formData.deliveryNotes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment Information */}
              {step === 3 && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Confirm Your Order</h2>
                  <p className="text-muted-foreground mb-8">
                    Review your order summary below. You will be redirected to our secure payment partner to complete
                    your purchase.
                  </p>
                  <div className="bg-secondary/50 border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Your payment will be processed securely by Paystack.</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="mt-8 pt-8 border-t border-border">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tax:</span>
                    <span className="font-medium">₦{tax.toLocaleString()}</span>
                  </div>
                  {deliveryMethod === "door-delivery" && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Delivery Fee ({formData.city}):</span>
                      <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center border-t border-border pt-4">
                  <span className="font-semibold text-foreground">Order Total:</span>
                  <span className="text-2xl font-bold text-rose-600">₦{totalWithDelivery.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white disabled:bg-rose-400"
                >
                  {isSubmitting ? "Processing..." : step === 2 ? "Proceed to Payment" : "Continue"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
