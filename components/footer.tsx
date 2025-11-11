import Link from "next/link"
import { Heart } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-foreground text-white pt-16 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-rose-400 mb-4">FlowerStalk</h3>
            <p className="text-white/70 text-sm">Premium handpicked flowers delivered fresh to your door</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-white/70 hover:text-rose-400 transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/gifts" className="text-white/70 hover:text-rose-400 transition">
                  Gift
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-rose-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-rose-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-rose-400 transition">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/70 hover:text-rose-400 transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-rose-400 transition">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-rose-400 transition">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-rose-400 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-white/70">📞 0817921852</li>
              <li className="text-white/70">📧 hello@flowerstalk.com</li>
              <li className="text-white/70">📍2 Oyinkan Abayomi Drive, Ikoyi Lagos</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm">© {currentYear} FlowerStalk. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
