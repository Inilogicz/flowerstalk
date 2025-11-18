// src/app/success/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header"; // Assuming Header is in components/header
import Footer from "@/components/footer"; // Assuming Footer is in components/footer
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui button
import { CheckCircle, Home, ShoppingBag, Loader2, AlertCircle } from "lucide-react"; // Icons
import { useCart } from "@/lib/cart-context"; // Assuming your cart context

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart(); // Get clearCart function from your context

    const [orderId, setOrderId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null); // e.g., 'success', 'failed'
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Clear the cart on page load for a successful checkout
        clearCart();
        // Parse query parameters
        const id = searchParams.get("trxref") || searchParams.get("reference"); // Use 'trxref' or 'reference' from Paystack
        const status = searchParams.get("status"); // e.g., from a payment gateway

        setOrderId(id);
        setPaymentStatus(status);
        setIsLoading(false);

        // Optional: You might want to make a backend call here to verify the payment
        // with the payment gateway using the order_id/payment_intent and update
        // the order status in your database.
        // For this example, we'll just display what's in the URL.

    }, [searchParams, clearCart]); // Dependency array includes searchParams and clearCart

    // You might want to show a loading state if verifying with backend
    if (isLoading) {
        return (
            <main className="flex flex-col w-full min-h-screen">
                <Header />
                <section className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 text-rose-600 animate-spin mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-foreground">Processing your order...</h1>
                        <p className="text-muted-foreground mt-2">Please wait while we confirm your payment.</p>
                    </div>
                </section>
                <Footer />
            </main>
        );
    }

    // Determine if it's a success or if there's an issue based on status or lack of orderId
    const isSuccessful = paymentStatus === "success" || orderId; // Assuming if orderId exists, it's generally successful or needs less emphasis on 'failure'
    const title = isSuccessful ? "Order Placed Successfully!" : "Payment Status Unknown";
    const description = isSuccessful
        ? "Your payment was successful and your order has been placed. We'll send a confirmation email shortly."
        : "We couldn't confirm your payment status. Please check your email or contact support with your payment reference.";
    const icon = isSuccessful
        ? <CheckCircle className="w-16 h-16 text-rose-600 mb-6" />
        : <AlertCircle className="w-16 h-16 text-yellow-500 mb-6" />; // Assuming AlertCircle is available, or use a different icon

    return (
        <main className="flex flex-col w-full min-h-screen">
            <Header />

            <section className="flex-1 flex items-center justify-center bg-background py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto text-center bg-card border border-border rounded-2xl p-8 shadow-lg">
                    {icon}
                    <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
                    <p className="text-lg text-muted-foreground mb-6">
                        {description}
                    </p>

                    {orderId && (
                        <div className="bg-secondary/50 rounded-lg p-4 mb-8">
                            <p className="text-sm text-muted-foreground">Your Order ID:</p>
                            <p className="text-xl font-semibold text-foreground break-all">{orderId}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <Button asChild className="w-full bg-rose-600 hover:bg-rose-700 text-white">
                            <Link href="/">
                                <Home className="w-4 h-4 mr-2" /> Continue Shopping
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full border-rose-600 text-rose-600 hover:bg-rose-50">
                            {/* This link should ideally go to a user's order history page */}
                            <Link href="/track">
                                <ShoppingBag className="w-4 h-4 mr-2" /> Track Your Orders
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

// Note: If AlertCircle and Loader2 are not available from lucide-react,
// you might need to import them:
// import { AlertCircle, Loader2 } from "lucide-react";
// Or use similar icons you have available.

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessLoading() {
  return (
    <main className="flex flex-col w-full min-h-screen">
      <Header />
      <section className="flex-1 flex items-center justify-center p-4">
        <Loader2 className="h-12 w-12 text-rose-600 animate-spin" />
      </section>
      <Footer />
    </main>
  );
}