export default function RidersTableSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-500">
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="space-y-3 sm:space-y-4 p-4 sm:p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 sm:h-12 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
