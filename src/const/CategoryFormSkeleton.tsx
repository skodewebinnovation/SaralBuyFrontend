import { Skeleton } from "@/Components/ui/skeleton";

export default function CategoryFormSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">

      <div className="w-full md:w-1/3 border-gray-100 border rounded-lg p-4 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64 w-full rounded-md" />
      </div>

      <div className="w-full md:w-2/3 space-y-6">
        {/* Product Details */}
        <div className="border-gray-100 border rounded-lg p-4 space-y-4">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>

        <div className="border-gray-100 border rounded-lg p-4 space-y-4">
          <Skeleton className="h-5 w-1/4" />
          <div className="flex gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-20 w-full" />
        </div>


        <div className="border-gray-100 border rounded-lg p-4 space-y-4">
          <Skeleton className="h-5 w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
