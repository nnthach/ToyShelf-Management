import { Button } from "@/src/styles/components/ui/button";
import { Product } from "@/src/types";
import { Eye } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  handleViewDetail: (productId: string) => void;
}
function ProductCard({ product, handleViewDetail }: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const selectedColor = product.colors?.[selectedColorIndex];
  const image = selectedColor?.imageUrl;

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-4 hover:shadow-lg transition">
      {/* Image */}
      <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-3">
        <div className="aspect-square">
          {image && (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>

        {/* Eye Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleViewDetail(product.id)}
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
          <div className="bg-white/90 backdrop-blur-sm px-3 py-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">SKU</span>
              <span className="font-medium text-gray-900">
                {selectedColor?.sku}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Giá</span>
              <span className="font-medium text-gray-900">
                {selectedColor?.price.toLocaleString()}đ
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Name */}
      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
        {product.name}
      </h3>
      {/* Base price nếu cần */}
      <p className="text-sm text-gray-600 mb-2">
        {product.price.toLocaleString()}đ
      </p>
      {/* Color selector */}
      <div className="flex items-center gap-2">
        {product.colors?.map((color, index) => (
          <button
            key={color.id}
            onClick={() => setSelectedColorIndex(index)}
            className={`w-4 h-4 rounded-full border-2 transition
              ${
                selectedColorIndex === index
                  ? "border-black scale-110"
                  : "border-gray-300"
              }`}
            style={{
              backgroundColor: "#ccc", // nếu sau này bạn có màu thật thì thay bằng color.hex
            }}
          />
        ))}
      </div>{" "}
    </div>
  );
}

export default ProductCard;
