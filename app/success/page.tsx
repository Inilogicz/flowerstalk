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
    const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("pending");
    const [apiMessage, setApiMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const reference = searchParams.get("trxref") || searchParams.get("reference");
        
        // Retrieve orderNumber from sessionStorage
        const storedOrderNumber = sessionStorage.getItem('orderNumber');

        if (!reference) {
            setPaymentStatus("failed");
            setIsLoading(false);
            return;
        }

        // Use stored orderNumber, fallback to reference if not available
        setOrderId(storedOrderNumber || reference);

        const verifyPayment = async () => {
            try {
                const response = await fetch(`https://app.flowerstalk.org/v1/orders/verify-payment/${reference}`);
                const result = await response.json();

                setApiMessage(result.message || null);

                if (response.ok && result.status) {
                    if (result.data.paymentStatus === 'paid') {
                        setPaymentStatus("success");
                        clearCart();
                        // Clear the stored orderNumber after success
                        sessionStorage.removeItem('orderNumber');
                    } else {
                        setPaymentStatus("pending");
                    }
                } else {
                    setPaymentStatus("failed");
                }
            } catch (error) {
                console.error("Payment verification failed:", error);
                setPaymentStatus("failed");
            } finally {
                setIsLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams, clearCart]);

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
    let title = "Payment Status Unknown";
    let description = "We could not verify the status of your payment.";
    let icon = <AlertCircle className="w-16 h-16 text-yellow-500 mb-6" />;

    if (paymentStatus === "success") {
        title = "Order Placed Successfully!";
        description = apiMessage || "Your payment was successful and your order has been placed. We'll send a confirmation email shortly.";
        icon = <CheckCircle className="w-16 h-16 text-rose-600 mb-6" />;
    } else if (paymentStatus === "pending") {
        title = "Payment Processing";
        description = "We have received your order, but the payment confirmation is still pending. Please check your email for updates.";
        icon = <Loader2 className="w-16 h-16 text-blue-500 mb-6 animate-spin" />;
    } else {
        title = "Payment Failed or Not Verified";
        description = apiMessage || "There was an issue verifying your payment. If you were debited, please contact support.";
        icon = <AlertCircle className="w-16 h-16 text-red-500 mb-6" />;
    }

    return (
        <main className="flex flex-col w-full min-h-screen">
            <Header />

            <section className="flex-1 flex items-center justify-center bg-background py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto text-center bg-card border border-border rounded-2xl p-8 shadow-lg">
                    {icon}
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{title}</h1>
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
