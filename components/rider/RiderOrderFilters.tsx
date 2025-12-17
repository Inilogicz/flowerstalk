// src/components/rider/RiderOrderFilters.tsx

import { Search, Calendar } from "lucide-react"
import { DateRange } from "@/hooks/useRiderOrdersData"

interface RiderOrderFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterStatus: string
  setFilterStatus: (status: string) => void
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
}

export default function RiderOrderFilters({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  dateRange,
  setDateRange,
}: RiderOrderFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Order Reference..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-rose-500/50"
        />
      </div>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-rose-500/50"
      >
        <option value="">All Statuses</option>
        <option value="assigned">Assigned (New)</option>
        <option value="rider_accept_order">Accepted</option>
        <option value="rider_pickedup">Picked Up</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-rose-500/50"
          title="Start Date"
        />
      </div>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          min={dateRange.from}
          disabled={!dateRange.from}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-rose-500/50 disabled:bg-gray-100"
          title="End Date"
        />
      </div>
    </div>
  )
}