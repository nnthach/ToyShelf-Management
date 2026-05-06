import { useShelfDetailSheet } from "@/src/context/ShelfDetailSheetContext";
import { Badge } from "@/src/styles/components/ui/badge";
import { InventoryShelf, Shelf } from "@/src/types";
import Image from "next/image";

interface ShelfCardWithQuantityProps {
  shelf: Shelf;
  inventoryList?: InventoryShelf;
}
function ShelfCardWithQuantity({
  shelf,
  inventoryList,
}: ShelfCardWithQuantityProps) {
  const { openById } = useShelfDetailSheet();

  return (
    <div
      onClick={() => openById(shelf.shelfTypeId)}
      className="group rounded-xl cursor-pointer border border-gray-100 bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
        <Image
          src={shelf?.imageUrl || "/images/placeholder.png"}
          alt={shelf?.shelfTypeName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
        />

        {/* Badge số tầng ở góc trái trên */}
        <div className="absolute top-2 inset-x-2 flex justify-between items-start z-10">
          <div className="flex flex-col gap-1">
            <span className="bg-emerald-50/90 backdrop-blur-sm text-[11px] font-bold px-2 py-1 rounded-md shadow-sm text-emerald-700 border border-emerald-200/50 w-fit">
              {inventoryList?.type === "Store" ? (
                <>Sử dụng: {shelf?.inUse}</>
              ) : (
                <>Kho: {shelf?.available || 0}</>
              )}
            </span>

            <div className="flex flex-col gap-1 transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
              {shelf?.reserved >= 0 && inventoryList?.type !== "Store" && (
                <span className="bg-blue-50/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-md shadow-sm text-blue-700 border border-blue-200/50 w-fit">
                  Được đặt: {shelf.reserved}
                </span>
              )}

              {shelf?.inTransit >= 0 && (
                <span className="bg-yellow-50/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-md shadow-sm text-yellow-700 border border-yellow-200/50 w-fit">
                  Đang về: {shelf.inTransit}
                </span>
              )}

              {shelf?.pendingMaintenance >= 0 && (
                <span className="bg-orange-50/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-md shadow-sm text-orange-700 border border-orange-200/50 w-fit">
                  Chờ thu hồi: {shelf.pendingMaintenance}
                </span>
              )}
              {shelf?.maintenance >= 0 && (
                <span className="bg-red-50/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-md shadow-sm text-red-700 border border-red-200/50 w-fit">
                  Thu hồi: {shelf.maintenance}
                </span>
              )}
            </div>
          </div>
          <Badge className="h-6 min-w-[60px] justify-center bg-white/90 text-gray-900 border-none shadow-sm backdrop-blur-sm px-2">
            {shelf?.totalLevels} tầng
          </Badge>
        </div>
      </div>

      {/* Info Content */}
      <div className="flex flex-col gap-1">
        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {shelf.shelfTypeName}
        </h3>

        {/* Description/Guideline */}
        <p className="text-xs text-gray-500 line-clamp-1">
          {shelf?.displayGuideline}
        </p>

        {/* Kích thước đem xuống dưới */}
        <div className="mt-1 flex items-center gap-1 text-[12px] text-gray-800">
          <span className="font-medium">Kích thước:</span>
          <span>
            {shelf?.width} × {shelf?.depth} × {shelf?.height} (cm)
          </span>
        </div>
      </div>
    </div>
  );
}

export default ShelfCardWithQuantity;
