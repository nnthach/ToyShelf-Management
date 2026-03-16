"use client";

import { Button } from "@/src/styles/components/ui/button";
import { Product, ProductColorItem } from "@/src/types";
import { Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

function ProductOrderCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (productColorId: string) => void;
}) {
  const [selectedVariant, setSelectedVariant] = useState(product.colors[0]);

  return (
    <div className="group rounded-xl border bg-card p-3 transition-all hover:shadow-lg hover:border-primary/50 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-square rounded-lg bg-muted mb-3 overflow-hidden">
        <Image
          src={selectedVariant?.imageUrl || ""}
          alt={product?.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="object-cover  transition-transform duration-300"
        />

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              selectedVariant?.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {selectedVariant?.isActive ? "Còn hàng" : "Hết hàng"}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1">
        <h4 className="font-bold text-sm lg:text-base line-clamp-1">
          {product?.name}
        </h4>
        <p className="text-xs text-muted-foreground mb-1">
          {product?.brand} - {product?.material}
        </p>

        {/* Price - Thay đổi theo màu */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="font-bold text-lg text-primary">
            {selectedVariant.price.toLocaleString()}đ
          </span>
        </div>

        {/* Color Selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.colors.map((color: ProductColorItem) => (
            <button
              key={color.id}
              onClick={() => setSelectedVariant(color)}
              className={`w-6 h-6 rounded-full border-2 transition-all p-0.5 ${
                selectedVariant.id === color.id
                  ? "border-primary scale-110"
                  : "border-transparent hover:border-gray-300"
              }`}
              title={color.sku}
            >
              {/* Giả sử bạn có mã màu hex, nếu không có thể dùng ảnh nhỏ hoặc text viết tắt */}
              <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-[8px]">
                {color.sku.split("-").pop()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <Eye size={16} />
        </Button>

        <Button
          className="flex-1"
          onClick={() => onAddToCart(selectedVariant.id)}
        >
          <ShoppingCart size={16} />
          Thêm
        </Button>
      </div>
    </div>
  );
}

export default ProductOrderCard;
