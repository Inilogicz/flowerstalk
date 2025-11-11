"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Eye, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import OrdersTableSkeleton from "@/components/admin/orders-table-skeleton"
import OrderDetailModal from "@/components/admin/order-detail-modal"

const BASE_URL = "https://app.flowerstalk.org/v1"

interface Order {
  _id: string
  reference: string
  deliveryData: {
    senderName: string
    location: string
    receiversName: string
    receiversPhone: string
    deliveryAddress: string
  }
  items: Array<{ quantity: number; itemId: any }>
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
  riderId?: string
}

interface PaginationData {
  currentPage: number
  totalPages: number
  total: number
  limit: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [token, setToken] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken")
    if (storedToken) setToken(storedToken)
  }, [])

  useEffect(() => {
    if (token) fetchOrders()
  }, [token, currentPage])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/orders?page=${currentPage}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.data) {
        setOrders(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "accepted":
        return "bg-blue-100 text-blue-700"
      case "assigned":
        return "bg-purple-100 text-purple-700"
      case "completed":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock
      case "accepted":
      case "assigned":
        return CheckCircle
      case "completed":
        return CheckCircle
      default:
        return AlertCircle
    }
  }

  if (loading) return <OrdersTableSkeleton />

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-500">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Orders Management</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage and track all customer orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-yellow-50 border-yellow-200 p-4 sm:p-6">
          <p className="text-sm text-gray-700 mb-2">Pending Orders</p>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-700">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </Card>
        <Card className="bg-blue-50 border-blue-200 p-4 sm:p-6">
          <p className="text-sm text-gray-700 mb-2">In Transit</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-700">
            {orders.filter((o) => o.status === "assigned").length}
          </p>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200 p-4 sm:p-6">
          <p className="text-sm text-gray-700 mb-2">Completed</p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-700">
            {orders.filter((o) => o.status === "completed").length}
          </p>
        </Card>
      </div>

      {/* Mobile Expandable Cards & Desktop Table */}
      <div className="space-y-3 sm:space-y-4">
        <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reference</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status)
                  const statusColor = getStatusColor(order.status)
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-rose-600">{order.reference}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{order.deliveryData.receiversName}</p>
                          <p className="text-gray-600">{order.deliveryData.receiversPhone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">{order.deliveryData.location}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">₦{order.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit text-sm font-medium ${statusColor}`}
                        >
                          <StatusIcon size={16} />
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowDetailModal(true)
                          }}
                          size="sm"
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                        >
                          <Eye size={16} />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:hidden space-y-3">
          {orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status)
            const statusColor = getStatusColor(order.status)
            const isExpanded = expandedOrderId === order._id

            return (
              <Card
                key={order._id}
                className="bg-white border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-semibold text-rose-600 mb-2">{order.reference}</p>
                    <p className="font-medium text-gray-900 truncate">{order.deliveryData.receiversName}</p>
                    <div
                      className={`flex items-center gap-2 w-fit mt-2 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                    >
                      <StatusIcon size={14} />
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-gray-400 flex-shrink-0 mt-1" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400 flex-shrink-0 mt-1" />
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Phone</p>
                      <p className="text-sm text-gray-900">{order.deliveryData.receiversPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Location</p>
                      <p className="text-sm text-gray-900">{order.deliveryData.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Delivery Address</p>
                      <p className="text-sm text-gray-900">{order.deliveryData.deliveryAddress}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Amount</p>
                      <p className="text-lg font-bold text-gray-900">₦{order.totalAmount.toLocaleString()}</p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedOrder(order)
                        setShowDetailModal(true)
                      }}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white mt-4"
                    >
                      View Full Details
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-gray-600 text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
              className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowDetailModal(false)}
          onUpdate={() => {
            setShowDetailModal(false)
            fetchOrders()
          }}
          token={token}
        />
      )}
    </div>
  )
}
