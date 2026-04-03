export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4">
      {/* Banner skeleton */}
      <div className="h-40 bg-gray-100 rounded-lg animate-pulse" />

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="h-[500px] bg-gray-100 rounded-lg animate-pulse" />
    </div>
  );
}
