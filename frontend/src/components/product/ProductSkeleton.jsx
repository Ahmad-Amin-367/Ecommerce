export default function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-cloud rounded-2xl overflow-hidden shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-cream/60 w-full" />

      {/* Info Skeleton */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Category Badge Skeleton */}
        <div className="h-2.5 bg-cloud/60 rounded-full w-1/3" />
        
        {/* Title Skeleton */}
        <div className="space-y-1.5">
          <div className="h-3.5 bg-cloud/80 rounded-full w-[90%]" />
          <div className="h-3.5 bg-cloud/80 rounded-full w-[60%]" />
        </div>

        {/* Price Skeleton */}
        <div className="h-4 bg-cloud rounded-full w-1/4 mt-auto pt-2" />
      </div>
    </div>
  );
}
