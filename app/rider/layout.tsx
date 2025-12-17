"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut, BarChart3, Package, MapPin, Truck, Users, Flower } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RiderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isAuthPage = pathname?.startsWith("/rider/login") || pathname?.startsWith("/rider/signup") || pathname?.startsWith("/rider/forgot-password")

  const navItems = [
    { href: "/rider/dashboard", label: "Dashboard", icon: BarChart3 },
    // { href: "/rider/items", label: "Items", icon: Package },
    // { href: "/rider/locations", label: "Locations", icon: MapPin },
    { href: "/rider/orders", label: "Orders", icon: Truck },
    // { href: "/rider/riders", label: "Riders", icon: Users },
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = () => {
    localStorage.removeItem("riderToken")
    window.location.href = "/rider/login"
  }

  if (!mounted) return null

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`fixed lg:static h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-out z-50 shadow-lg lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        <div className={`flex flex-col h-full ${isCollapsed ? "p-4" : "p-6"}`}>
          <div className={`mb-8 pb-6 border-b border-gray-200 ${isCollapsed ? "flex justify-center" : ""}`}>
            <div className={`flex items-center gap-2 mb-2 ${isCollapsed ? "justify-center" : ""}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Flower size={20} className="text-white" />
              </div>
              {!isCollapsed && <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">FlowerStalk</h1>}
            </div>
            {!isCollapsed && <p className="text-xs text-gray-500 whitespace-nowrap">Rider's Dashboard</p>}
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
                    active
                      ? "bg-rose-100 text-rose-700 border border-rose-200"
                      : "text-gray-700 hover:text-rose-600 hover:bg-gray-50"
                  } ${isCollapsed ? "justify-center px-2" : ""}`}
                  onClick={() => setSidebarOpen(false)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          <Button
            onClick={handleLogout}
            className={`w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-medium ${isCollapsed ? "px-0 justify-center" : ""}`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut size={16} className={isCollapsed ? "" : "mr-2"} />
            {!isCollapsed && "Logout"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-sm">
          <button
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setIsCollapsed(!isCollapsed)
              } else {
                setSidebarOpen(!sidebarOpen)
              }
            }}
            className="text-gray-700 hover:text-rose-600 transition-colors"
          >
            <div className="lg:hidden">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
            <div className="hidden lg:block">
              <Menu size={24} />
            </div>
          </button>
          <div className="flex-1 text-center lg:text-right">
            <div className="text-gray-600 text-sm font-medium">Welcome back, Rider</div>
            <div className="text-gray-500 text-xs">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
