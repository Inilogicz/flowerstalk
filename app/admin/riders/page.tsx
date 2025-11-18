"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, AlertCircle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import RidersTableSkeleton from "@/components/admin/riders-table-skeleton"
import RiderDetailsModal from "@/components/admin/rider-details-modal"

const BASE_URL = "https://app.flowerstalk.org/v1"

interface Rider {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  status: string
  isAvailable: string
  documentType: string
  documentNumber: string
  createdAt: string
  frontImage?: string
  backImage?: string
  updatedAt: string
}

interface PaginationData {
  currentPage: number
  totalPages: number
  total: number
  limit: number
}

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [token, setToken] = useState("")
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken")
    if (storedToken) { setToken(storedToken) }
  }, [])

  useEffect(() => {
    if (token) fetchRiders()
  }, [token, currentPage])

  const fetchRiders = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/dashboard/list-riders?page=${currentPage}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.data) {
        setRiders(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Failed to fetch riders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveReject = async (riderId: string, newStatus: string) => {
    setActionLoading(riderId)
    try {
      const response = await fetch(`${BASE_URL}/dashboard/approve-reject-rider`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          riderId,
          status: newStatus,
        }),
      })

      if (response.ok) {
        fetchRiders()
        setSelectedRider(null) // Close modal on success
      }
    } catch (error) {
      console.error("Action failed:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700"
      case "PENDING":
        return "bg-yellow-100 text-yellow-700"
      case "REJECTED":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return CheckCircle
      case "REJECTED":
        return XCircle
      default:
        return AlertCircle
    }
  }

  const getAvailabilityColor = (available: string) => {
    return available === "available" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
  }

  if (loading) return <RidersTableSkeleton />

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Riders Management</h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage and approve delivery partners</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-emerald-50 border border-emerald-200 p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Total Riders</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pagination?.total || 0}</p>
        </Card>
        <Card className="bg-yellow-50 border border-yellow-200 p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Pending Approval</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {riders.filter((r) => r.status === "PENDING").length}
          </p>
        </Card>
        <Card className="bg-blue-50 border border-blue-200 p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Available Now</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {riders.filter((r) => r.isAvailable === "available").length}
          </p>
        </Card>
      </div>

      {/* Riders Table - Desktop */}
      <div className="hidden md:block">
        <Card className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700">Contact</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700">Document</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700">Availability</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {riders.map((rider) => {
                  const StatusIcon = getStatusIcon(rider.status)
                  const statusColor = getStatusColor(rider.status)
                  return (
                    <tr
                      key={rider._id}
                      onClick={() => setSelectedRider(rider)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {rider.firstName} {rider.lastName}
                          </p>
                          <p className="text-gray-500 text-xs">ID: {rider._id.slice(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="text-sm">
                          <p className="text-gray-900">{rider.email}</p>
                          <p className="text-gray-500">{rider.phoneNumber}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{rider.documentType}</p>
                          <p className="text-gray-500">{rider.documentNumber}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div
                          className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full w-fit text-xs sm:text-sm font-medium ${statusColor}`}
                        >
                          <StatusIcon size={14} />
                          <span>{rider.status}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit block ${getAvailabilityColor(rider.isAvailable)}`}
                        >
                          {rider.isAvailable === "available" ? "Available" : "Busy"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex gap-2">
                          {rider.status !== "APPROVED" ? (
                            <>
                              <Button
                                onClick={() => handleApproveReject(rider._id, "APPROVED")}
                                disabled={actionLoading === rider._id}
                                size="sm"
                                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                              >
                                <CheckCircle size={14} />
                              </Button>
                              <Button
                                onClick={() => handleApproveReject(rider._id, "REJECTED")}
                                disabled={actionLoading === rider._id}
                                size="sm"
                                className="bg-red-100 hover:bg-red-200 text-red-700"
                              >
                                <XCircle size={14} />
                              </Button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-600">Approved</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Riders Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {riders.map((rider) => {
          const StatusIcon = getStatusIcon(rider.status)
          const statusColor = getStatusColor(rider.status)

          return (
            <Card
              key={rider._id}
              onClick={() => setSelectedRider(rider)}
              className="bg-white border border-gray-200 p-4 cursor-pointer"
            >
              <div className="w-full flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {rider.firstName} {rider.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                    >
                      <StatusIcon size={12} />
                      {rider.status}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(rider.isAvailable)}`}
                    >
                      {rider.isAvailable === "available" ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-gray-600 text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900"
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {selectedRider && (
        <RiderDetailsModal
          rider={selectedRider}
          onClose={() => setSelectedRider(null)}
          onAction={handleApproveReject}
          actionLoading={actionLoading === selectedRider._id}
        />
      )}
    </div>
  )
}
