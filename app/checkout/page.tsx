"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin, Home, CheckCircle } from "lucide-react"
import { useCart, CartItem } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { Location, LocationsApiResponse } from "./types" // Assuming types are correctly defined

/**
 * Helper function to validate email format
 */
const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

const USER_DETAILS_STORAGE_KEY = "flowerstalk_checkout_user_details";

export default function Checkout() {
  const STORE_PICKUP_DETAILS = {
    address: "2 Oyinkan Abayomi Drive, Ikoyi, Lagos",
  };

  const [step, setStep] = useState(1) // 1: Details, 2: Confirmation
  const [deliveryMethod, setDeliveryMethod] = useState<"door-delivery" | "pickup">("door-delivery")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "", // Pickup notes
    deliveryNotes: "", // Door delivery notes
  })
  const [locations, setLocations] = useState<Location[]>([])
  const [locationsLoading, setLocationsLoading] = useState(true)

  const { cartItems, subtotal, tax, total, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  // --- Location Data Fetching ---
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLocationsLoading(true)
        // NOTE: In a real app, you might want to proxy this API call
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
        toast({ variant: "default", title: "Could not load delivery locations" })
      } finally {
        setLocationsLoading(false)
      }
    }
    fetchLocations()
  }, [toast])

  // --- Load user details from local storage on initial render ---
  useEffect(() => {
    try {
      const savedDetails = localStorage.getItem(USER_DETAILS_STORAGE_KEY);
      if (savedDetails) {
        const parsedDetails = JSON.parse(savedDetails);
        // Pre-fill personal details, leaving delivery/order-specific fields empty
        setFormData((prev) => ({
          ...prev,
          firstName: parsedDetails.firstName || "",
          lastName: parsedDetails.lastName || "",
          email: parsedDetails.email || "",
          phone: parsedDetails.phone || "",
        }));
      }
    } catch (error) {
      console.error("Failed to load user details from local storage:", error);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Derived State (useMemo for optimization) ---
  const deliveryLocations = useMemo(() => locations.filter((loc) => loc.type !== "pickup"), [locations])

  const selectedDeliveryLocation = useMemo(() => 
    deliveryLocations.find((loc) => loc.location === formData.city), 
    [deliveryLocations, formData.city]
  )
  
  const deliveryFee = selectedDeliveryLocation?.amount || 0
  
  const totalWithDelivery = subtotal + tax + (deliveryMethod === "door-delivery" ? deliveryFee : 0)

  // --- Handlers & Validation ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    const { firstName, lastName, email, phone, address, city, deliveryNotes } = formData;

    // Base validation for all methods
    if (!firstName || !lastName || !email || !phone) {
      toast({ variant: "destructive", title: "Please fill in all personal details." });
      return false;
    }

    if (!isValidEmail(email)) {
      toast({ variant: "destructive", title: "Please enter a valid email address." });
      return false;
    }
    
    // Conditional validation for Door Delivery
    if (deliveryMethod === "door-delivery") {
      if (!address || !city || !deliveryNotes) {
        toast({ variant: "destructive", title: "Please fill in all delivery details, including notes." });
        return false;
      }
      if (!selectedDeliveryLocation) {
        toast({ title: "Selected city is not a valid delivery location.", variant: "destructive" });
        return false;
      }
      const locationId = selectedDeliveryLocation?._id;
      if (!locationId) {
        toast({ variant: "destructive", title: "A location must be selected for delivery." });
        return false;
      }
    }

    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Step 1: Validation and Transition
    if (step === 1) {
      if (validateStep1()) {
        // Save user details to local storage for next visit
        try {
          const userDetailsToSave = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          };
          localStorage.setItem(USER_DETAILS_STORAGE_KEY, JSON.stringify(userDetailsToSave));
        } catch (error) {
          console.error("Failed to save user details to local storage:", error);
        }
        setStep(2)
      }
      return
    }

    // Step 2: Submission and Payment Redirection
    setIsSubmitting(true)
  
    // Validate cart is not empty (redundant but good safety check)
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const orderPayload = {
      items: cartItems.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
      })),
      deliveryType: deliveryMethod === "door-delivery" ? "delivery" : "pickup",
      ...(deliveryMethod === "door-delivery" && {
        locationId: selectedDeliveryLocation?._id,
        deliveryData: {
          senderName: `${formData.firstName} ${formData.lastName}`,
          senderPhone: formData.phone,
          senderEmail: formData.email,
          receiversName: `${formData.firstName} ${formData.lastName}`, // Assuming sender is receiver for now
          receiversPhone: formData.phone,
          location: formData.city,
          deliveryDate: new Date().toISOString(), // In a real app, this should be selected by the user
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
          pickupDate: new Date().toISOString(), // In a real app, this should be selected by the user
          pickupAddress: STORE_PICKUP_DETAILS.address,
          note: formData.notes || "No notes provided.", // Provide a default if notes are empty
        },
      }),
    }
  
    try {
      const response = await fetch("https://app.flowerstalk.org/v1/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })
  
      const result = await response.json()
  
      if (!response.ok || !result.status) {
        // Log detailed error from API if available
        console.error("API Error creating order:", result);
        throw new Error(result.message || "Failed to create order.");
      }
  
      if (result.paymentLink) {
        // Successful order creation, redirect to payment
        window.location.href = result.paymentLink // Redirect to Paystack
      } else {
        throw new Error("Payment link not received in API response.")
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      toast({
        title: "Order Failed",
        description: (error as Error).message || "There was an issue placing your order.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // --- Rendered Component ---
  return (
    <main className="flex flex-col w-full min-h-screen">
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
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s <= step ? "bg-rose-600 text-white" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                {s < 2 && (
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
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-foreground">Personal & Delivery Details</h2>
                  
                  {/* Personal Info Block */}
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
                  
                  {/* Delivery Method Selection */}
                  <div className="space-y-4 pt-8 border-t border-border">
                    <label
                      className="flex items-start p-4 border-2 border-border rounded-lg cursor-pointer transition"
                      style={{ borderColor: deliveryMethod === "door-delivery" ? "rgb(225, 29, 72)" : undefined }}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="door-delivery"
                        checked={deliveryMethod === "door-delivery"}
                        onChange={(e) => setDeliveryMethod(e.target.value as "door-delivery" | "pickup")}
                        className="mt-1 mr-4 accent-rose-600"
                        required
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          <Home className="w-4 h-4" /> Door Delivery
                        </p>
                        <p className="text-sm text-muted-foreground">Delivery to your doorstep</p>
                      </div>
                    </label>

                    <label
                      className="flex items-start p-4 border-2 border-border rounded-lg cursor-pointer transition"
                      style={{ borderColor: deliveryMethod === "pickup" ? "rgb(225, 29, 72)" : undefined }}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="pickup"
                        checked={deliveryMethod === "pickup"}
                        onChange={(e) => setDeliveryMethod(e.target.value as "door-delivery" | "pickup")}
                        className="mt-1 mr-4 accent-rose-600"
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

                    {/* Conditional Delivery Details Block */}
                    {deliveryMethod === "door-delivery" && (
                      <div className="space-y-4 bg-secondary/50 p-6 rounded-lg transition-all duration-300">
                        <h3 className="font-semibold text-foreground mb-4">Door Delivery Information</h3>
                        <input
                          type="text"
                          name="address"
                          placeholder="Street Address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required={deliveryMethod === "door-delivery"}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                        />

                        <div className="grid grid-cols-1 gap-4">
                          {locationsLoading ? (
                            <Skeleton className="h-[50px] w-full rounded-lg" />
                          ) : (
                            <select
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange} // This is the location dropdown
                              required={deliveryMethod === "door-delivery"}
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                            >
                              <option value="">Select City (Required)</option>
                              {deliveryLocations.map((loc) => (
                                <option key={loc._id} value={loc.location} >
                                  {loc.location} (₦{(loc.amount ?? 0).toLocaleString()})
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <textarea
                          name="deliveryNotes"
                          placeholder="Delivery notes - e.g., Gate code, building details"
                          value={formData.deliveryNotes}
                          required={deliveryMethod === "door-delivery"}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                        />
                      </div>
                    )}

                    {/* Conditional Pickup Details Block */}
                    {deliveryMethod === "pickup" && (
                      <div className="space-y-4 bg-secondary/50 p-6 rounded-lg transition-all duration-300">
                        <h3 className="font-semibold text-foreground">Store Pickup Information</h3>
                        <p className="text-sm text-muted-foreground">
                          {locationsLoading ? (
                            <Skeleton className="h-5 w-3/4" /> // Keep skeleton for layout consistency
                          ) : (
                            `Available for pickup at: ${STORE_PICKUP_DETAILS.address}`
                          )}
                        </p>
                        <textarea
                          name="notes"
                          placeholder="Special notes (optional) - e.g., preferred pickup time, proxy pickup"
                          value={formData.notes}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                        />
                      </div>
                    )}
                </div>
              )}

              {/* Step 2: Confirmation & Summary */}
              {step === 2 && (
                <div className="transition-opacity duration-500">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Confirm & Pay</h2>
                  <p className="text-muted-foreground mb-8">
                    Review your order summary below. You will be redirected to our secure payment partner to complete
                    your purchase.
                  </p>
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-rose-700">Your payment will be processed securely by Paystack.</p>
                  </div>
                
                  <div className="mt-8 space-y-6">
                    {/* Order Items Summary */}
                    <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-foreground">Items in Your Order</h3>
                      <div className="border-t border-border pt-4">
                        <div className="space-y-3">
                          {cartItems.map((item: CartItem) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
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

                    {/* Contact & Delivery/Pickup Details Summary */}
                    <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-foreground">
                        {deliveryMethod === "door-delivery" ? "Delivery Information" : "Pickup Information"}
                      </h3>
                      <div className="text-sm space-y-2 border-t border-border/50 pt-4">
                        <p>
                          <span className="font-medium text-muted-foreground">Name: </span>
                          <span className="text-foreground">{formData.firstName} {formData.lastName}</span>
                        </p>
                        <p>
                          <span className="font-medium text-muted-foreground">Contact: </span>
                          <span className="text-foreground">{formData.email} / {formData.phone}</span>
                        </p>
                        {deliveryMethod === "door-delivery" ? (
                          <>
                            <p>
                              <span className="font-medium text-muted-foreground">Address: </span>
                              <span className="text-foreground">{formData.address}, {formData.city}</span>
                            </p>
                            {formData.deliveryNotes && <p><span className="font-medium text-muted-foreground">Notes: </span>{formData.deliveryNotes}</p>}
                          </>
                        ) : (
                          <>
                            <p>
                              <span className="font-medium text-muted-foreground">Pickup At: </span>
                              <span className="text-foreground">{STORE_PICKUP_DETAILS.address}</span>
                            </p>
                            {formData.notes && <p><span className="font-medium text-muted-foreground">Notes: </span>{formData.notes}</p>}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Summary (Always visible in Step 2) */}
              <div className={`mt-8 pt-8 border-t border-border ${step === 2 ? 'block' : 'hidden md:block'}`}> {/* Show on step 2, or maybe collapse in step 1 if screen space is tight */}
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
                      <span className="text-muted-foreground">Delivery Fee ({formData.city || 'Select City'}):</span>
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
                    className="flex-1 bg-transparent border-rose-600 text-rose-600 hover:bg-rose-50"
                    onClick={() => setStep(step - 1)}
                    disabled={isSubmitting}
                  > 
                    Back to Details
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white disabled:bg-rose-400"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : step === 1 ? (
                    "Continue to Confirmation"
                  ) : (
                    `Proceed to Payment (₦${totalWithDelivery.toLocaleString()})`
                  )}
                </Button>
              </div>
              {cartItems.length === 0 && (
                <p className="text-center text-sm text-red-500 mt-4">Your cart is empty. Please add items to proceed.</p>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}