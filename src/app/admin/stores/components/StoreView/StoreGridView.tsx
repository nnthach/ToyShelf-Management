import { Button } from "@/src/styles/components/ui/button";
import { Download, Eye, Upload } from "lucide-react";
import React from "react";
import ProductCardSkeleton from "@/src/components/ProductCardSkeleton";

import { useRouter } from "next/navigation";
import { Store } from "@/src/types";
import { formatStoreStatusText } from "@/src/utils/formatStatus";

interface StoreGridViewProps {
  storeList: Store[];
  isLoading: boolean;
  children: React.ReactNode;
}

function StoreGridView({ storeList, isLoading, children }: StoreGridViewProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4 p-4 border-b flex justify-between items-center bg-white dark:bg-sidebar rounded-xl">
        {children}
        <div className="space-x-3">
          <Button>
            <Download /> Nhập khẩu
          </Button>
          <Button variant={"outline"}>
            <Upload /> Xuất khẩu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : storeList.map((store) => {
              const image = store.images?.[0];

              return (
                <div
                  key={store.id}
                  className="group rounded-xl border border-gray-200 bg-white p-4
               hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Image */}
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-2">
                    <div className="aspect-square">
                      {image && (
                        <img
                          src={image}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Eye button */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 z-20
               opacity-0 group-hover:opacity-100 transition"
                      onClick={() => router.push(`/admin/stores/${store.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* Hover info */}
                    <div
                      className="absolute inset-x-0 bottom-0 z-10
                   translate-y-full opacity-0
                   group-hover:translate-y-0 group-hover:opacity-100
                   transition-all duration-300 ease-out"
                    >
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Open day</span>
                          <span className="font-medium text-gray-900">
                            {store.openDay}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Open time</span>
                          <span className="font-medium text-gray-900">
                            {store.openTime} - {store.closeTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Address</span>
                          <span className="font-medium text-gray-900 truncate w-[150px]">
                            {store?.storeAddress}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-2">
                    <span
                      className="inline-flex items-center gap-1 rounded-full
                       bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      {formatStoreStatusText(store?.isActive)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {store?.name}
                  </h3>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default StoreGridView;
