import { Button } from "@/src/styles/components/ui/button";
import { Product } from "@/src/types";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useProductDetailSheet } from "../context/ProductDetailSheetContext";

interface ProductCardWithQuantityProps {
  product: Product;
}
function ProductCardWithQuantity({ product }: ProductCardWithQuantityProps) {
  const { openByData } = useProductDetailSheet();

  // color
  const [showMore, setShowMore] = useState(false);
  const displayLimit = 2;
  const hasMore = product.colors?.length > displayLimit;
  const visibleColors = product.colors?.slice(0, displayLimit);
  const remainingColors = product.colors?.slice(displayLimit);
  //end color

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const selectedColor = product?.colors?.[selectedColorIndex];
  const image = selectedColor?.imageUrl;

  return (
    <div className="group rounded-xl border border-gray-100 bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
        {image && (
          <Image
            src={image || "/images/placeholder.png"}
            alt={product.productName || ""}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
          />
        )}

        {/* quantity top left */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
          {/* Badge Kho: Luôn hiển thị */}
          <span className="bg-emerald-50/90 backdrop-blur-sm text-[11px] font-bold px-2 py-1 rounded-md shadow-sm text-emerald-700 border border-emerald-200/50 w-fit">
            Kho: {selectedColor?.quantity || selectedColor?.available || 0}
          </span>

          {/* Container cho các badge phụ: Chỉ hiện khi hover group */}
          <div className="flex flex-col gap-1 transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
            {selectedColor?.inTransit >= 0 && (
              <span className="bg-blue-50/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-md shadow-sm text-blue-700 border border-blue-200/50 w-fit">
                Đang về: {selectedColor.inTransit}
              </span>
            )}

            {selectedColor?.damaged >= 0 && (
              <span className="bg-red-50/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-md shadow-sm text-red-700 border border-red-200/50 w-fit">
                Lỗi: {selectedColor.damaged}
              </span>
            )}
          </div>
        </div>

        {/* Eye Button (Góc phải trên) */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => openByData(product)}
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
              <span className="text-gray-500">Mã sản phẩm</span>
              <span className="font-medium text-gray-900">
                {selectedColor?.productColorSku}{" "}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Hãng</span>
              <span className="font-medium text-gray-900">
                {product?.brand}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Danh mục</span>
              <span className="font-medium text-gray-900">
                {product?.productCategoryName}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 ">
          {product.productName}
        </h3>

        <div className="flex  items-center justify-between gap-0.5">
          {/* Base price nếu cần */}
          <p className="text-sm text-gray-600">
            {selectedColor?.productColorPrice?.toLocaleString()}đ
          </p>

          {/* Color selector */}
          <div className="flex items-center gap-2">
            {visibleColors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColorIndex(index)}
                className={`w-5 h-5 rounded-full border transition-all duration-300 transform hover:scale-110 ${
                  selectedColorIndex === index
                    ? "border-gray-500 scale-110"
                    : "border-transparent"
                }`}
                style={{
                  backgroundColor: color.hexCode,
                  boxShadow:
                    "inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 6px rgba(0,0,0,0.1)",
                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)`,
                }}
              />
            ))}

            {hasMore && (
              <div className="relative">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="w-5 h-5 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-[10px] font-bold hover:bg-gray-100 transition"
                >
                  +{remainingColors.length}
                </button>

                {/* Bảng màu mở rộng (Absolute) */}
                {showMore && (
                  <>
                    {/* Backdrop để bấm ra ngoài thì đóng */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMore(false)}
                    />

                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 bg-white p-2 shadow-xl border rounded-lg flex gap-2 min-w-max">
                      {remainingColors.map((color, index) => (
                        <button
                          key={color.id}
                          onClick={() => {
                            setSelectedColorIndex(index + displayLimit);
                            setShowMore(false);
                          }}
                          className="w-5 h-5 rounded-full border transition-all duration-300 transform hover:scale-110"
                          style={{
                            backgroundColor: color.hexCode,
                            boxShadow:
                              "inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 6px rgba(0,0,0,0.1)",
                            backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)`,
                          }}
                        />
                      ))}
                      {/* Mũi tên nhỏ trỏ xuống */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCardWithQuantity;
