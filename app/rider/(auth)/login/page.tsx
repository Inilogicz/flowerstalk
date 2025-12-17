"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Lock, Mail, ArrowRight } from "lucide-react" // Added ArrowRight

// Use the environment variable for the base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!BASE_URL) {
      setError("Configuration Error: API base URL is missing.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${BASE_URL}/riders/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.token) {
        localStorage.setItem("riderToken", data.token)
        router.push("/rider/dashboard")
      } else {
        // Use a more specific error message if available in the API response
        setError(data.message || "Login failed. Please check your credentials and try again.")
      }
    } catch (err) {
      console.error("Login attempt failed:", err)
      setError("A network error occurred. Please check your connection or try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Background Decoration - subtle */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Using larger, less opaque blurs for a softer effect */}
          <div className="absolute -top-60 -right-60 w-[40rem] h-[40rem] bg-rose-100/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-60 -left-60 w-[40rem] h-[40rem] bg-pink-100/10 rounded-full blur-3xl"></div>
        </div>

        <Card className="relative bg-white border-slate-200 shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-700 bg-clip-text text-transparent mb-2">
                FlowerStalk
              </h1>
              <p className="text-slate-600 font-medium text-lg">Rider Portal Sign In</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {/* Optional: Add Forgot Password link */}
                <div className="text-right mt-2">
                    <button type="button" onClick={() => router.push("/rider/forgot-password")} className="text-xs text-rose-500 hover:text-rose-600 font-medium">
                        Forgot Password?
                    </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-800 text-sm font-medium" role="alert">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-rose-500/20 transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In to Your Account"
                )}
              </Button>
            </form>

            {/* Link to Signup/Registration */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-600">
                    New Rider?{" "}
                    <button 
                        type="button" 
                        onClick={() => router.push("/rider/signup")} 
                        className="text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center group"
                    >
                        Register Here
                        <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}