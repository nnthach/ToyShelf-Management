function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      {/* Image skeleton */}
      <div className="mb-2">
        <div className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
      </div>

      {/* Status */}
      <div className="mb-2">
        <div className="h-5 w-20 rounded-full bg-gray-200 animate-pulse" />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
export default ProductCardSkeleton;
