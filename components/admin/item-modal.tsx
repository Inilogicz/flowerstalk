"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

const BASE_URL = "https://app.flowerstalk.org/v1"

interface ItemModalProps {
  item: any | null
  onClose: () => void
  onSave: () => void
  token: string
}

export default function ItemModal({ item, onClose, onSave, token }: ItemModalProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    category: "Flowers",
    imageUrl: "",
    stock: 0,
  })

  useEffect(() => {
    if (item) {
      setFormData(item)
    }
  }, [item])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formDataObj = new FormData()
    formDataObj.append("image", file)

    try {
      const response = await fetch(`${BASE_URL}/uploads/single`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      })
      const data = await response.json()
      if (data.imageUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }))
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = item ? `${BASE_URL}/items/${item._id}` : `${BASE_URL}/items/add`
      const method = item ? "PUT" : "POST"

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
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/50 border-b border-slate-700/50 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">{item ? "Edit Item" : "Add New Item"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Product Image</label>
            <div className="flex gap-4">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              <label className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg p-4 cursor-pointer hover:border-slate-500 hover:bg-slate-800/30 transition-colors">
                <div className="text-center">
                  <Upload size={24} className="text-slate-400 mx-auto mb-2" />
                  <span className="text-sm text-slate-400">Upload image</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Price (₦)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500/50"
            >
              <option>Flowers</option>
              <option>Bouquets</option>
              <option>Arrangements</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500/50 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Item"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
