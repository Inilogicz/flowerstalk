export default function LocationsTableSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded-lg w-64 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-100 rounded w-24 animate-pulse"></div>
            <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
