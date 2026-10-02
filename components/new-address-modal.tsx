"use client"

import { useEffect, useState } from "react"
import { MapPin, ArrowDown } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { STORE_ADDRESS, PREVIOUS_ADDRESS, DIRECTIONS_URL, MOVE_NOTICE_KEY } from "@/lib/store-location"

const MODAL_KEY = `${MOVE_NOTICE_KEY}-modal`

export default function NewAddressModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    let seen = false
    try {
      seen = localStorage.getItem(MODAL_KEY) === "seen"
    } catch {}
    if (seen) return

    // Small delay so the page settles before the announcement appears
    const timer = setTimeout(() => setIsOpen(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      try {
        localStorage.setItem(MODAL_KEY, "seen")
      } catch {}
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-rose-500 to-rose-700 px-6 pt-10 pb-8 text-center text-white">
          <span className="absolute top-4 left-6 text-2xl opacity-40 rotate-12">✿</span>
          <span className="absolute bottom-4 right-8 text-3xl opacity-30 -rotate-12">✿</span>
          <span className="absolute top-8 right-12 text-lg opacity-40">✿</span>

          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <MapPin className="w-8 h-8 animate-bounce" />
          </div>
          <DialogTitle className="text-3xl font-bold text-white">We&apos;ve Moved!</DialogTitle>
          <DialogDescription className="text-white/85 mt-2">
            Same fresh blooms, brand new home.
          </DialogDescription>
        </div>

        {/* Old → New */}
        <div className="px-6 pt-6 pb-2 text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Old address</p>
          <p className="text-sm text-muted-foreground line-through">{PREVIOUS_ADDRESS}</p>

          <ArrowDown className="w-5 h-5 text-rose-600 mx-auto my-3 animate-pulse" />

          <p className="text-xs uppercase tracking-wider text-rose-600 font-semibold mb-1">New address</p>
          <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3">
            <p className="font-semibold text-foreground">{STORE_ADDRESS.line1}</p>
            <p className="text-sm text-muted-foreground">{STORE_ADDRESS.line2}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-4 flex flex-col sm:flex-row gap-3">
          <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white">Get Directions</Button>
          </a>
          <Button variant="outline" className="flex-1" onClick={() => handleOpenChange(false)}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
