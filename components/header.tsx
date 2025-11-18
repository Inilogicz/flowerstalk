"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { cartCount } = useCart()

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-rose-600">
              FlowerStalk
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-rose-600 transition">
              Home
            </Link>
            <Link href="/shop" className="text-foreground hover:text-rose-600 transition">
              Shop
            </Link>
            <Link href="/gifts" className="text-foreground hover:text-rose-600 transition">
              Gifts
            </Link>
            <Link href="/about" className="text-foreground hover:text-rose-600 transition">
              About Us
            </Link>
            <Link href="/contact" className="text-foreground hover:text-rose-600 transition">
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-secondary rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Search flowers..."
                className="bg-transparent text-sm outline-none w-32 text-foreground placeholder:text-muted-foreground"
              />
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>

            <Link href="/track">
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                Track Order
              </Button>
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-foreground hover:text-rose-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-4 border-t border-border pt-4">
            <Link href="/" className="text-foreground hover:text-rose-600 transition">
              Home
            </Link>
            <Link href="/shop" className="text-foreground hover:text-rose-600 transition">
              Shop
            </Link>
            <Link href="/about" className="text-foreground hover:text-rose-600 transition">
              About Us
            </Link>
            <Link href="/contact" className="text-foreground hover:text-rose-600 transition">
              Contact
            </Link>
            <Link href="/track" className="w-full">
              <Button className="w-full">Track Order</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
