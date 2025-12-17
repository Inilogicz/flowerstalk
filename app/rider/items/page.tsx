"use client"

import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ItemsTableSkeleton from "@/components/admin/items-table-skeleton"
import ItemModal from "@/components/admin/item-modal"

const BASE_URL = "https://app.flowerstalk.org/v1"

interface Item {
  _id: string
  name: string
  price: number
  description: string
  category: string
  imageUrl: string
  stock: number
  createdAt: string
  updatedAt: string
}

interface PaginationData {
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [token, setToken] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken")
    if (storedToken) setToken(storedToken)
  }, [])

  useEffect(() => {
    if (token) fetchItems()
  }, [token, currentPage])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/items?page=${currentPage}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.status === "success" || data.status) {
        setItems(data.data || [])
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Failed to fetch items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      try {
        const response = await fetch(`${BASE_URL}/items/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          setItems(items.filter((item) => item._id !== id))
        }
      } catch (error) {
        console.error("Delete failed:", error)
      }
    }
  }

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) return <ItemsTableSkeleton />

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Items Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your flower inventory</p>
        </div>
        <Button
          onClick={() => {
            setSelectedItem(null)
            setShowModal(true)
          }}
          className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white w-full sm:w-fit"
        >
          <Plus size={18} className="mr-2" />
          Add Item
        </Button>
      </div>

      <Card className="bg-white border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </Card>

      <Card className="bg-white border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="hidden sm:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="hidden lg:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 text-gray-700">₦{item.price.toLocaleString()}</td>
                  <td className="hidden md:table-cell px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.stock} units
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 text-gray-700">{item.category}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          setSelectedItem(item)
                          setShowModal(true)
                        }}
                        size="sm"
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(item._id)}
                        size="sm"
                        className="bg-red-100 hover:bg-red-200 text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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

      {showModal && (
        <ItemModal
          item={selectedItem}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false)
            fetchItems()
          }}
          token={token}
        />
      )}
    </div>
  )
}
