"use client"

import { useEffect, useState } from "react"
import { Package, MapPin, Truck, Users, TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardSkeleton from "@/components/admin/dashboard-skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface DashboardStats {
  totalItems: number
  totalLocations: number
  totalOrders: number
  totalRiders: number
}

const chartData = [
  { day: "Mon", orders: 24, completed: 18 },
  { day: "Tue", orders: 32, completed: 28 },
  { day: "Wed", orders: 28, completed: 22 },
  { day: "Thu", orders: 35, completed: 30 },
  { day: "Fri", orders: 42, completed: 38 },
  { day: "Sat", orders: 38, completed: 35 },
  { day: "Sun", orders: 29, completed: 26 },
]

const recentOrders = [
  { id: "ORD001", customer: "John Doe", status: "completed", amount: "₦15,500" },
  { id: "ORD002", customer: "Jane Smith", status: "assigned", amount: "₦12,300" },
  { id: "ORD003", customer: "Mike Johnson", status: "pending", amount: "₦18,750" },
  { id: "ORD004", customer: "Sarah Williams", status: "completed", amount: "₦9,200" },
  { id: "ORD005", customer: "Tom Brown", status: "assigned", amount: "₦22,100" },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalItems: 45,
        totalLocations: 12,
        totalOrders: 328,
        totalRiders: 18,
      })
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  const statCards = [
    {
      title: "Total Items",
      value: stats?.totalItems,
      icon: Package,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: 12,
      trendUp: true,
    },
    {
      title: "Delivery Locations",
      value: stats?.totalLocations,
      icon: MapPin,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: 5,
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders,
      icon: Truck,
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
      trend: 8,
      trendUp: true,
    },
    {
      title: "Active Riders",
      value: stats?.totalRiders,
      icon: Users,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: 3,
      trendUp: false,
    },
  ]

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700"
      case "assigned":
        return "bg-blue-100 text-blue-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">Overview of your business performance</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon
          const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown
          const trendColor = stat.trendUp ? "text-green-600" : "text-red-600"

          return (
            <Card
              key={idx}
              className="bg-white border border-gray-200 p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 ${stat.bgColor} rounded-lg`}>
                  <Icon className={`${stat.iconColor}`} size={20} />
                </div>
                <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${trendColor}`}>
                  <TrendIcon size={14} />
                  {stat.trend}%
                </div>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">{stat.title}</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
            </Card>
          )
        })}
      </div>

      <Card className="bg-white border border-gray-200 p-4 sm:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Weekly Orders Overview</h2>
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: "12px" }} />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="orders" fill="#f87171" name="Total Orders" radius={[8, 8, 0, 0]} />
              <Bar dataKey="completed" fill="#34d399" name="Completed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="bg-white border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Orders</h2>
          <Button className="bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm">
            View All <ArrowRight size={14} className="ml-2" />
          </Button>
        </div>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold text-rose-600 mb-1">{order.id}</p>
                <p className="text-sm text-gray-700">{order.customer}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-full ${getStatusBadgeColor(order.status)}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="font-bold text-gray-900 text-sm">{order.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
