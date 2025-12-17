// src/hooks/useRiderOrdersData.ts

import { useState, useEffect, useCallback } from "react"
import { Clock, CheckCircle, AlertCircle, Package } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// --- Type Definitions ---

interface OrderItem {
  quantity: number
  itemId: any
  _id: string
}

export interface Order {
  _id: string
  reference: string
  deliveryData: {
    senderName: string
    senderPhone: string
    location: string // Pickup location
    receiversName: string
    receiversPhone: string
    deliveryAddress: string // Dropoff address
    note: string
  }
  items: OrderItem[]
  totalAmount: number
  deliveryFee: number
  tax: number
  status: 'assigned' | 'rider_accept_order' | 'rider_pickedup' | 'in_progress' | 'completed' | 'cancelled' | 'pending' | 'accepted'
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

export interface DateRange {
  from: string
  to: string
}

// --- Status Utility Functions ---

export const getStatusColor = (status: string) => {
  switch (status) {
    case "assigned":
      return "bg-purple-100 text-purple-700 border-purple-300" 
    case "rider_accept_order":
    case "accepted":
    case "rider_pickedup":
    case "in_progress":
      return "bg-blue-100 text-blue-700 border-blue-300"
    case "completed":
      return "bg-emerald-100 text-emerald-700 border-emerald-300"
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-300"
    default:
      return "bg-gray-100 text-gray-700 border-gray-300"
  }
}

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "assigned":
      return Package
    case "rider_accept_order":
    case "accepted":
    case "rider_pickedup":
    case "in_progress":
      return Clock
    case "completed":
      return CheckCircle
    default:
      return AlertCircle
  }
}

export function useRiderOrdersData() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [token, setToken] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" })

  useEffect(() => {
    const storedToken = localStorage.getItem("riderToken")
    if (storedToken) setToken(storedToken)
    else setLoading(false)
  }, [])

  const fetchOrders = useCallback(async () => {
    if (!token) return

    setLoading(true)
    try {
      // API endpoint for fetching rider-assigned orders
      const url = new URL(`${BASE_URL}/rider/orders/incoming-orders`) 
      url.searchParams.append("page", currentPage.toString())
      url.searchParams.append("limit", "10")
      if (filterStatus) url.searchParams.append("status", filterStatus)
      if (searchQuery) url.searchParams.append("search", searchQuery)
      if (dateRange.from) url.searchParams.append("startDate", dateRange.from)
      if (dateRange.to) url.searchParams.append("endDate", dateRange.to)

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (response.ok && data.data) {
        setOrders(data.data)
        setPagination(data.pagination)
      } else {
        console.error("API error:", data.message || "Failed to fetch orders for rider")
        setOrders([])
        setPagination(null)
      }
    } catch (error) {
      console.error("Network or parsing error:", error)
      setOrders([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [token, currentPage, filterStatus, searchQuery, dateRange])


  useEffect(() => {
    if (token) {
      fetchOrders()
    }
  }, [currentPage, token, fetchOrders])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (token) {
        if (currentPage !== 1) setCurrentPage(1)
        else fetchOrders()
      }
    }, 500) 
    return () => clearTimeout(handler)
  }, [searchQuery, token])

  useEffect(() => {
    if (token) {
      if (currentPage !== 1) setCurrentPage(1)
      else fetchOrders()
    }
  }, [filterStatus, token])

  useEffect(() => {
    if (token && ((dateRange.from && dateRange.to) || (!dateRange.from && !dateRange.to))) {
      if (currentPage !== 1) setCurrentPage(1)
      else fetchOrders()
    }
  }, [dateRange, token])


  const orderCounts = {
    assigned: orders.filter((o) => o.status === "assigned").length,
    inTransit: orders.filter((o) => o.status === "rider_accept_order" || o.status === "accepted" || o.status === "rider_pickedup" || o.status === "in_progress").length,
    delivered: orders.filter((o) => o.status === "completed").length,
  }

  return {
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
  }
}