"use client"

import { useEffect, useState } from "react"
import { MapPin, X } from "lucide-react"
import { STORE_ADDRESS, DIRECTIONS_URL, MOVE_NOTICE_KEY } from "@/lib/store-location"

const BAR_KEY = `${MOVE_NOTICE_KEY}-bar`

export default function NewAddressBar() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    try {
      setIsVisible(localStorage.getItem(BAR_KEY) !== "dismissed")
    } catch {
      setIsVisible(true)
    }
  }, [])

  const dismiss = () => {
    setIsVisible(false)
    try {
      localStorage.setItem(BAR_KEY, "dismissed")
    } catch {}
  }

  if (!isVisible) return null

  const message = (
    <span className="inline-flex items-center gap-2 whitespace-nowrap px-6">
      <span className="font-semibold">✿ We&apos;ve moved!</span>
      <span className="text-white/90">Visit our new shop at {STORE_ADDRESS.full}</span>
    </span>
  )

  return (
    <div className="relative w-full bg-rose-600 text-white text-sm">
      <div className="max-w-7xl mx-auto flex items-center gap-3 h-10 pl-4 pr-10 sm:px-6 lg:px-8">
        <MapPin className="w-4 h-4 shrink-0 animate-bounce" />

        {/* Scrolling on small screens, static on larger ones */}
        <div className="flex-1 overflow-hidden md:hidden">
          <div className="flex w-max animate-marquee motion-reduce:animate-none">
            {message}
            <span aria-hidden="true">{message}</span>
          </div>
        </div>
        <div className="hidden md:block flex-1 truncate">{message}</div>

        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-white text-rose-600 px-3 py-1 text-xs font-semibold hover:bg-rose-50 transition"
        >
          Get directions
        </a>
      </div>

      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
