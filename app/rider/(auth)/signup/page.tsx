"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Upload, User, Mail, Lock, Phone, FileText } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function RiderSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    documentType: "NIN",
    documentNumber: "",
    frontImage: "",
    backImage: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Handle Multi-file Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: 'frontImage' | 'backImage') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input value to allow re-selecting the same file if needed
    e.target.value = ""

    setUploading(true)
    const uploadData = new FormData()
    uploadData.append("files", file) // API expects 'files' array/multiple

    try {
      const res = await fetch(`${BASE_URL}/upload/file-multiple`, {
        method: "POST",
        body: uploadData,
      })
      const data = await res.json()
      
      if (res.ok && data.urls?.[0]) {
        setFormData(prev => ({ ...prev, [side]: data.urls[0] }))
      } else {
        setError("Image upload failed")
      }
    } catch (err) {
      setError("Error uploading images")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match")
    }

    if (!formData.frontImage || !formData.backImage) {
      return setError("Please upload both document images")
    }

    setLoading(true)
    
    // Exclude confirmPassword from the API payload
    const { confirmPassword, ...submitData } = formData

    try {
      const res = await fetch(`${BASE_URL}/riders/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })
      const data = await res.json()

      if (res.ok) {
        router.push("/rider/login?registered=true")
      } else {
        if (res.status === 409 || data.message?.toLowerCase().includes("email already exists")) {
          setError("This email is already registered. Please login instead.")
        } else {
          setError(data.message || "Signup failed")
        }
      }
    } catch (err) {
      setError("Network error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl p-8 shadow-xl bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rose-600">Join FlowerStalk</h1>
          <p className="text-slate-500 font-medium">Register as a delivery rider</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">First Name</label>
            <input name="firstName" onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-slate-50" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Last Name</label>
            <input name="lastName" onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-slate-50" required />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">Email</label>
            <input name="email" type="email" onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-slate-50" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Phone Number</label>
            <input name="phoneNumber" onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-slate-50" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Password</label>
            <input name="password" type="password" onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-slate-50" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Confirm Password</label>
            <input name="confirmPassword" type="password" onChange={handleChange} className="w-full p-2.5 border rounded-lg bg-slate-50" required />
          </div>

          <div className="md:col-span-2 border-t pt-4 mt-2">
            <h3 className="font-bold text-slate-700 mb-4">Identity Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="documentType" onChange={handleChange} className="p-2.5 border rounded-lg bg-slate-50">
                <option value="NIN">NIN</option>
                <option value="DL">Driver's License</option>
                <option value="Passport">International Passport</option>
              </select>
              <input name="documentNumber" placeholder="Document Number" onChange={handleChange} className="p-2.5 border rounded-lg bg-slate-50" required />
            </div>
          </div>

          {/* Image Uploads */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Document Front</label>
            <div className="relative border-2 border-dashed rounded-lg p-4 text-center hover:bg-rose-50 cursor-pointer transition-all h-32 flex items-center justify-center">
              <input type="file" onChange={(e) => handleFileUpload(e, 'frontImage')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              {formData.frontImage ? (
                <img src={formData.frontImage} alt="Front Preview" className="h-full w-full object-contain rounded-md" />
              ) : (
                <Upload className="mx-auto text-slate-400" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500">Document Back</label>
            <div className="relative border-2 border-dashed rounded-lg p-4 text-center hover:bg-rose-50 cursor-pointer transition-all h-32 flex items-center justify-center">
              <input type="file" onChange={(e) => handleFileUpload(e, 'backImage')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              {formData.backImage ? (
                <img src={formData.backImage} alt="Back Preview" className="h-full w-full object-contain rounded-md" />
              ) : (
                <Upload className="mx-auto text-slate-400" />
              )}
            </div>
          </div>

          {error && <div className="md:col-span-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          <Button type="submit" disabled={loading || uploading} className="md:col-span-2 bg-rose-600 hover:bg-rose-700 text-white h-12 rounded-xl">
            {loading ? <Loader2 className="animate-spin" /> : "Complete Registration"}
          </Button>

          <div className="md:col-span-2 text-center mt-2">
            <span className="text-sm text-slate-500">Already have an account? </span>
            <Link href="/rider/login" className="text-sm font-bold text-rose-600 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}