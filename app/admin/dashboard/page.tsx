"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, Truck, Users, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardSkeleton from "@/components/admin/dashboard-skeleton"
import OrderDetailsModal from "@/components/admin/order-details-modal"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const BASE_URL = "https://app.flowerstalk.org/v1"

interface DashboardTotals {
  totalRiders: number
  totalItems: number
  totalOrders: number
  totalActiveRiders: number
  totalOrderwithDeliverLocation: number
}

interface WeeklyChartData {
  day: string
  totalOrders: number
  completedOrders: number
}

interface Item {
  itemId: {
    _id: string
    name: string
    price: number
    imageUrl: string
  }
  quantity: number
  _id: string
}

interface RecentOrder {
  _id: string
  orderNumber: string
  deliveryData: {
    senderName: string
    receiversName: string
    senderPhone: string
    receiversPhone: string
    deliveryAddress: string
  }
  status: string
  totalAmount: number
  items: Item[]
  deliveryFee: number
  tax: number
  riderId?: string
}

export default function DashboardPage() {
  const [totals, setTotals] = useState<DashboardTotals | null>(null)
  const [chartData, setChartData] = useState<WeeklyChartData[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null)

  const fetchData = async () => {
    const storedToken = localStorage.getItem("adminToken")
    setToken(storedToken || "")
    if (!storedToken) {
      setLoading(false)
      // Handle case where token is not available, e.g., redirect to login
      return
    }

    try {
      setLoading(true)
      const headers = { Authorization: `Bearer ${storedToken}` }
      const [totalsRes, weeklyOrdersRes, recentOrdersRes] = await Promise.all([
        fetch(`${BASE_URL}/dashboard/totals`, { headers }),
        fetch(`${BASE_URL}/dashboard/weekly-orders`, { headers }),
        fetch(`${BASE_URL}/dashboard/recent-orders`, { headers }),
      ])

      if (totalsRes.ok) {
        const data = await totalsRes.json()
        setTotals(data)
      }

      if (weeklyOrdersRes.ok) {
        const data = await weeklyOrdersRes.json()
        // Map API data to the format expected by the chart
        const formattedChartData = data.days.map((d: any) => ({
          day: d.day.substring(0, 3), // "Monday" -> "Mon"
          totalOrders: d.totalOrders,
          completedOrders: d.completedOrders,
        }))
        setChartData(formattedChartData)
      }

      if (recentOrdersRes.ok) {
        const data = await recentOrdersRes.json()
        setRecentOrders(data.orders)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      // Optionally, show a toast notification for the error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleModalUpdate = () => {
    setSelectedOrder(null)
    fetchData() // Re-fetch dashboard data to show updated order status
  }

  if (loading && recentOrders.length === 0) {
    return <DashboardSkeleton />
  }

  const statCards = [
    {
      title: "Total Products",
      value: totals?.totalItems,
      icon: Package,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: totals?.totalOrders,
      icon: Truck,
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      title: "Active Riders",
      value: totals?.totalActiveRiders,
      icon: Users,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Riders",
      value: totals?.totalRiders,
      icon: Users,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
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
      case "accepted":
        return "bg-indigo-100 text-indigo-700"
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

          return (
            <Card
              key={idx}
              className="bg-white border border-gray-200 p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className={`p-2 sm:p-3 ${stat.bgColor} rounded-lg w-fit mb-3 sm:mb-4`}>
                <Icon className={`${stat.iconColor}`} size={20} />
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
              <Bar dataKey="totalOrders" fill="#f87171" name="Total Orders" radius={[8, 8, 0, 0]} />
              <Bar dataKey="completedOrders" fill="#34d399" name="Completed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="bg-white border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders">
            <Button className="bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm">
              View All <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order._id}
              onClick={() => setSelectedOrder(order)}
              className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold text-rose-600 mb-1">{order.orderNumber}</p>
                <p className="text-sm text-gray-700">{order.deliveryData.senderName}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-full ${getStatusBadgeColor(order.status)}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="font-bold text-gray-900 text-sm">₦{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAssign={handleModalUpdate}
          token={token}
          onUpdate={handleModalUpdate}
        />
      )}
    </div>
  )
}
