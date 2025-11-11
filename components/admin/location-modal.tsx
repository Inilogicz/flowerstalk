"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const BASE_URL = "https://app.flowerstalk.org/v1"

interface LocationModalProps {
  location: any | null
  onClose: () => void
  onSave: () => void
  token: string
}

export default function LocationModal({ location, onClose, onSave, token }: LocationModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    location: "",
    amount: 0,
  })

  useEffect(() => {
    if (location) {
      setFormData(location)
    }
  }, [location])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = location ? `${BASE_URL}/locations/${location._id}` : `${BASE_URL}/locations`
      const method = location ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSave()
      }
    } catch (error) {
      console.error("Submit failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-50 duration-300">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl w-full max-w-md animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-slate-900/50 border-b border-slate-700/50 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">{location ? "Edit Location" : "Add Location"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Location Name</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Lekki, Island, Ikeja"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Delivery Fee (₦)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Location"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
