import { Button } from "@/src/styles/components/ui/button";
import { Product, Shelf } from "@/src/types";
import { Eye } from "lucide-react";
import Image from "next/image";
import { memo, useState } from "react";

interface ShelfCardProps {
  shelf: Shelf;
  handleViewDetail: (shelfId: string) => void;
}
function ShelfCard({ shelf, handleViewDetail }: ShelfCardProps) {
  return (
    <div className="group rounded-xl border border-gray-100 bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
        <Image
          src={shelf.imageUrl || "/images/placeholder.png"}
          alt={shelf.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
        />

        {/* Eye Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleViewDetail(shelf.id)}
          className="absolute top-2 right-2 z-20
                     opacity-0 group-hover:opacity-100
                     transition bg-white/80 backdrop-blur-sm"
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
          <div className="bg-white/90 backdrop-blur-sm px-3 py-2 text-xs rounded-b-lg">
            <div className="flex justify-between">
              <span className="text-gray-500">Kích thước</span>
              <span className="font-medium text-gray-900">
                {shelf?.width} x {shelf?.depth} x {shelf?.height}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Số tầng</span>
              <span className="font-medium text-gray-900">
                {shelf?.totalLevels}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col ">
        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
          {shelf.name}
        </h3>
        <p className="text-xs text-gray-500">{shelf.displayGuideline}</p>
      </div>
    </div>
  );
}

export default memo(ShelfCard);
