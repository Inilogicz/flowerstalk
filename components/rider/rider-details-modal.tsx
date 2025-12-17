"use client"

import { X, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

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
  updatedAt?: string
  frontImage?: string
  backImage?: string
}

interface RiderDetailsModalProps {
  rider: Rider
  onClose: () => void
  onAction: (riderId: string, status: "APPROVED" | "REJECTED") => void
  actionLoading: boolean
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <p className="text-sm text-slate-800 font-medium">{value}</p>
  </div>
)

export default function RiderDetailsModal({
  rider,
  onClose,
  onAction,
  actionLoading,
}: RiderDetailsModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

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

  const StatusIcon = getStatusIcon(rider.status)

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-50 duration-300">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            {rider.firstName} {rider.lastName}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <X size={24} />
          </button>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              label="Status"
              value={
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full w-fit text-xs font-medium ${getStatusColor(rider.status)}`}
                >
                  <StatusIcon size={14} />
                  <span>{rider.status}</span>
                </div>
              }
            />
            <DetailItem
              label="Availability"
              value={
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium w-fit block ${getAvailabilityColor(rider.isAvailable)}`}
                >
                  {rider.isAvailable === "available" ? "Available" : "Busy"}
                </span>
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailItem label="Email Address" value={rider.email} />
            <DetailItem label="Phone Number" value={rider.phoneNumber} />
          </div>

          <DetailItem
            label="Document"
            value={`${rider.documentType} - ${rider.documentNumber}`}
          />

          <div className="pt-2 border-t border-slate-200">
            <DetailItem
              label="Date Joined"
              value={new Date(rider.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </div>

          {(rider.frontImage || rider.backImage) && (
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-2">Uploaded Documents</p>
              <div className="flex gap-4">
                {rider.frontImage && (
                  <button onClick={() => setPreviewImage(rider.frontImage!)} className="w-1/2 text-left">
                    <img
                      src={rider.frontImage}
                      alt="Document Front"
                      className="rounded-lg border border-slate-200 w-full h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                    <p className="text-center text-xs text-slate-600 mt-1">Front</p>
                  </button>
                )}
                {rider.backImage && (
                  <button onClick={() => setPreviewImage(rider.backImage!)} className="w-1/2 text-left">
                    <img
                      src={rider.backImage}
                      alt="Document Back"
                      className="rounded-lg border border-slate-200 w-full h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                    <p className="text-center text-xs text-slate-600 mt-1">Back</p>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {rider.status === "PENDING" && (
          <div className="sticky bottom-0 bg-slate-50/80 backdrop-blur-sm border-t border-slate-200 p-4 flex gap-3">
            <Button
              onClick={() => onAction(rider._id, "REJECTED")}
              disabled={actionLoading}
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-700"
            >
              {actionLoading ? <Loader2 size={18} className="mr-2 animate-spin" /> : "Reject"}
            </Button>
            <Button
              onClick={() => onAction(rider._id, "APPROVED")}
              disabled={actionLoading}
              className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
            >
              {actionLoading ? <Loader2 size={18} className="mr-2 animate-spin" /> : "Approve"}
            </Button>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Document Preview"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
          />
        </div>
      )}
    </div>
  )
}