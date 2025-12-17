// src/app/rider/dashboard/OrdersPage.tsx

"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Eye, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Import necessary dependencies
import OrdersTableSkeleton from "@/components/admin/orders-table-skeleton" // Assuming shared skeleton
import RiderOrderDetailsModal from "@/components/rider/RiderOrderDetailsModal" 
import RiderOrderFilters from "@/components/rider/RiderOrderFilters" 

// Import the custom hook and types
import { useRiderOrdersData, getStatusColor, getStatusIcon, Order } from "@/hooks/useRiderOrdersData" 


export default function RiderOrdersPage() {
  const {
    orders,
    loading,
    pagination,
    currentPage,
    setCurrentPage,
    fetchOrders,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    orderCounts,
    token,
  } = useRiderOrdersData()

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  if (loading) return <OrdersTableSkeleton />
  
  if (!token) return (
    <div className="text-center py-12 bg-white border border-red-200 rounded-lg">
      <h3 className="text-lg font-semibold text-red-800">Authentication Required</h3>
      <p className="text-gray-500 mt-2">
        Please log in to access your assigned orders.
      </p>
    </div>
  )

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Assigned Deliveries</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage and track your delivery routes.</p>
      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-purple-50 border border-purple-200 p-4 sm:p-6">
          <p className="text-sm text-gray-700 mb-2">New Assignments</p>
          <p className="text-2xl sm:text-3xl font-bold text-purple-700">{orderCounts.assigned}</p>
        </Card>
        <Card className="bg-blue-50 border border-blue-200 p-4 sm:p-6">
          <p className="text-sm text-gray-700 mb-2">In Transit</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-700">{orderCounts.inTransit}</p>
        </Card>
        <Card className="bg-emerald-50 border border-emerald-200 p-4 sm:p-6">
          <p className="text-sm text-gray-700 mb-2">Delivered</p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-700">{orderCounts.delivered}</p>
        </Card>
      </div>

      {/* No results message */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">No Orders Assigned</h3>
          <p className="text-gray-500 mt-2">
            You currently do not have any orders matching your current filters.
          </p>
        </div>
      )}
     

      {/* Order Details Modal */}
      {selectedOrder && (
        <RiderOrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={() => {
            setSelectedOrder(null)
            fetchOrders() // Re-fetch all orders to show updated status immediately
          }}
          token={token}
        />
      )}
    </div>
  )
}