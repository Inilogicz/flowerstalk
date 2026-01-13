// src/app/success/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ShoppingBag, Loader2, Copy, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";

function SuccessContent() {
    const { clearCart } = useCart();
    const [orderId, setOrderId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // 1. Retrieve the order ID specifically from session storage
        const savedOrderId = sessionStorage.getItem('orderNumber');
        
        if (savedOrderId) {
            setOrderId(savedOrderId);
        }
        clearCart();


    }, [clearCart]);

    const handleCopy = () => {
        if (orderId) {
            navigator.clipboard.writeText(orderId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <main className="flex flex-col w-full min-h-screen">
            <Header />

            <section className="flex-1 flex items-center justify-center bg-background py-16 px-4">
                <div className="max-w-md w-full text-center bg-card border border-border rounded-2xl p-8 shadow-lg">
                    <CheckCircle className="w-16 h-16 text-rose-600 mx-auto mb-6" />
                    
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                        Order Placed!
                    </h1>
                    
                    <p className="text-lg text-muted-foreground mb-8">
                        Thank you for your purchase. Your order has been received and is now being processed.
                    </p>

                    {orderId ? (
                        <div className="bg-secondary/50 rounded-xl p-5 mb-8 border border-dashed border-muted-foreground/30 relative">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
                                Your Order ID
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <code className="text-xl font-mono font-bold text-foreground break-all">
                                    {orderId}
                                </code>
                                <button 
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-background rounded-md transition-colors text-rose-600"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            {copied && (
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-rose-600 font-medium animate-in fade-in slide-in-from-top-1">
                                    Copied to clipboard!
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="mb-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                            Order ID not found. Please check your email for confirmation.
                        </div>
                    )}

                    <div className="flex flex-col gap-4 mt-4">
                        <Button asChild className="w-full bg-rose-600 hover:bg-rose-700 text-white h-12">
                            <Link href="/">
                                <Home className="w-4 h-4 mr-2" /> Continue Shopping
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full border-rose-600 text-rose-600 hover:bg-rose-50 h-12">
                            <Link href="/track">
                                <ShoppingBag className="w-4 h-4 mr-2" /> Track Your Order
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

// Wrapped in Suspense as a best practice for Next.js app directory pages
export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-10 w-10 text-rose-600 animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}