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

      {/* Filters and Search */}
      <RiderOrderFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

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

      {/* Mobile Expandable Cards & Desktop Table */}
      <div className={`space-y-3 sm:space-y-4 ${orders.length === 0 ? 'hidden' : ''}`}>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reference</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Recipient</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Drop-off Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status)
                  const statusColor = getStatusColor(order.status)
                  const formattedStatus = order.status.replace(/_/g, ' ')
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
                      <td className="px-6 py-4 text-gray-700 text-sm max-w-xs truncate">{order.deliveryData.deliveryAddress}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">₦{order.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit text-sm font-medium border ${statusColor}`}
                        >
                          <StatusIcon size={16} />
                          <span className="capitalize">{formattedStatus}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          onClick={() => {
                            setSelectedOrder(order)
                          }}
                          size="sm"
                          variant="outline"
                          className="text-gray-700 border-gray-300"
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

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3">
          {orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status)
            const statusColor = getStatusColor(order.status)
            const isExpanded = expandedOrderId === order._id
            const formattedStatus = order.status.replace(/_/g, ' ')

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
                      className={`flex items-center gap-2 w-fit mt-2 px-2 py-1 rounded-full text-xs font-medium border ${statusColor}`}
                    >
                      <StatusIcon size={14} />
                      <span className="capitalize">{formattedStatus}</span>
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
                      <p className="text-xs text-gray-600 font-medium">Delivery Address</p>
                      <p className="text-sm text-gray-900">{order.deliveryData.deliveryAddress}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Amount to Collect</p>
                      <p className="text-lg font-bold text-gray-900">₦{order.totalAmount.toLocaleString()}</p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedOrder(order)
                      }}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white mt-4"
                    >
                      View & Update Status
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && orders.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-gray-600 text-sm">
            Page {pagination.currentPage} of {pagination.totalPages} (Total: {pagination.total})
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
              className="text-gray-700 border-gray-300"
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
              variant="outline"
              className="text-gray-700 border-gray-300"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
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