"use client"

import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { FlowerCarousel } from "./flower-carousel"

export const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Main content section */}
      <div className="container relative mx-auto px-4 py-2 md:py-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left content */}
          <div
            className={`transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-sm font-medium text-primary/60 tracking-widest uppercase">
                  Premium Collection
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight text-balance">
                Gifts and Flowers
                <span className="block text-primary">for Your Beloved</span>
              </h1>

              <p className="text-lg md:text-xl text-foreground/70 max-w-xl leading-relaxed">
                We pride ourselves in the quality of our products and services. Express your love with our handcrafted
                bouquets.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                <Button
                  size="lg"
                  className="group bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <button className="text-foreground/60 hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <FlowerCarousel />
          </div>
        </div>
      </div>

      {/* Trust badges section - from original sample */}
      <div className="relative bg-gradient-to-t from-background via-background/80 to-transparent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 text-foreground">
            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-foreground">Delivery</div>
                <div className="text-sm text-foreground/60">#2 Oyinkan Abayomi Drive, Ikoyi Lagoss</div>
              </div>
            </div>

            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-foreground">Fresh Flowers</div>
                <div className="text-sm text-foreground/60">Handpicked daily</div>
              </div>
            </div>

            <div className="flex items-start gap-4 group cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-foreground">Secure Checkout</div>
                <div className="text-sm text-foreground/60">100% secure payments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
