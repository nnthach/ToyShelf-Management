import { Button } from "@/src/styles/components/ui/button";
import { Shelf } from "@/src/types";
import Image from "next/image";
import { CartItem } from "../page";
import { Badge } from "@/src/styles/components/ui/badge";
import { useShelfDetailSheet } from "@/src/context/ShelfDetailSheetContext";

interface ShelfCardOrderProps {
  shelf: Shelf;
  handleAddToCart: (item: CartItem) => void;
  handleRemoveFromCart: (shelfTypeId: string) => void;
  cart: CartItem[];
}
function ShelfCardOrder({
  shelf,
  handleAddToCart,
  handleRemoveFromCart,
  cart,
}: ShelfCardOrderProps) {
  const { openById } = useShelfDetailSheet();

  const cartItem = cart.find((i) => i.shelfTypeId === shelf.id);
  return (
    <div
      onClick={() => openById(shelf.id)}
      className="group rounded-xl border border-gray-100 bg-white p-4 cursor-pointer
  shadow-[0_3px_10px_rgb(0,0,0,0.1)] 
  hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
  transition-all duration-300 
  flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
        <Image
          src={shelf.imageUrl || "/images/placeholder.png"}
          alt={shelf.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
        />

        {/* Badge số tầng ở góc trái trên */}
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-white/90 text-gray-900 hover:bg-white/100 border-none shadow-sm backdrop-blur-sm">
            {shelf?.totalLevels} tầng
          </Badge>
        </div>
      </div>

      {/* Info Content */}
      <div className="flex flex-col gap-1">
        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {shelf.name}
        </h3>

        {/* Description/Guideline */}
        <p className="text-xs text-gray-500 line-clamp-1">
          {shelf.displayGuideline}
        </p>

        {/* Kích thước đem xuống dưới */}
        <div className="mt-1 flex items-center gap-1 text-[12px] text-gray-800">
          <span className="font-medium">Kích thước:</span>
          <span>
            {shelf?.width} × {shelf?.depth} × {shelf?.height} (cm)
          </span>
        </div>
      </div>

      {/* Nút Add to Cart */}
      <div className="mt-2">
        {!cartItem ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart({
                shelfTypeId: shelf.id,
                quantity: 1,
                name: shelf.name,
                image: shelf.imageUrl || "/images/placeholder.png",
                description: shelf.displayGuideline,
                totalLevels: shelf.totalLevels,
                width: shelf.width,
                depth: shelf.depth,
                height: shelf.height,
              });
            }}
            className="w-full bg-gray-900 hover:bg-blue-600 text-white"
          >
            Thêm vào giỏ hàng
          </Button>
        ) : (
          <div className="flex items-center justify-between border rounded-lg px-2 py-1">
            <Button
              size="icon"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFromCart(shelf.id);
              }}
            >
              -
            </Button>

            <span className="font-medium">{cartItem.quantity}</span>

            <Button
              size="icon"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart({
                  shelfTypeId: shelf.id,
                  quantity: 1,
                  name: shelf.name,
                  image: shelf.imageUrl || "/images/placeholder.png",
                  description: shelf.displayGuideline,
                  totalLevels: shelf.totalLevels,
                  width: shelf.width,
                  depth: shelf.depth,
                  height: shelf.height,
                });
              }}
            >
              +
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShelfCardOrder;
