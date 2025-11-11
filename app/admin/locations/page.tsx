"use client"

import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import LocationsTableSkeleton from "@/components/admin/locations-table-skeleton"
import LocationModal from "@/components/admin/location-modal"

const BASE_URL = "https://app.flowerstalk.org/v1"

interface Location {
  _id: string
  location: string
  amount: number
  createdAt: string
  updatedAt: string
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [token, setToken] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken")
    if (storedToken) setToken(storedToken)
  }, [])

  useEffect(() => {
    if (token) fetchLocations()
  }, [token])

  const fetchLocations = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/locations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setLocations(Array.isArray(data.data) ? data.data : [])
    } catch (error) {
      console.error("Failed to fetch locations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Delete this location?")) {
      try {
        await fetch(`${BASE_URL}/locations/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
        setLocations(locations.filter((loc) => loc._id !== id))
      } catch (error) {
        console.error("Delete failed:", error)
      }
    }
  }

  if (loading) return <LocationsTableSkeleton />

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">Delivery Locations</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage delivery zones and fees</p>
        </div>
        <Button
          onClick={() => {
            setSelectedLocation(null)
            setShowModal(true)
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-fit"
        >
          <Plus size={18} className="mr-2" />
          Add Location
        </Button>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {locations.map((location) => (
          <Card
            key={location._id}
            className="bg-white border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 sm:p-3 bg-emerald-50 rounded-lg">
                <MapPin className="text-emerald-600" size={20} />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedLocation(location)
                    setShowModal(true)
                  }}
                  size="sm"
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  onClick={() => handleDelete(location._id)}
                  size="sm"
                  className="bg-red-100 hover:bg-red-200 text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{location.location}</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-xl sm:text-2xl font-bold text-gray-900">₦{location.amount.toLocaleString()}</span>
              <span className="text-gray-600 text-xs sm:text-sm">delivery fee</span>
            </div>

            <div className="space-y-1 text-xs text-gray-600 pt-4 border-t border-gray-200">
              <p>Added: {new Date(location.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(location.updatedAt).toLocaleDateString()}</p>
            </div>
          </Card>
        ))}
      </div>

      {locations.length === 0 && (
        <Card className="bg-white border border-gray-200 p-12 text-center">
          <MapPin size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">No locations added yet</p>
        </Card>
      )}

      {showModal && (
        <LocationModal
          location={selectedLocation}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false)
            fetchLocations()
          }}
          token={token}
        />
      )}
    </div>
  )
}
