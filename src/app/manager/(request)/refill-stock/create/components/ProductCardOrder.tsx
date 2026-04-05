import { Button } from "@/src/styles/components/ui/button";
import { Product } from "@/src/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CartItem } from "../page";
import { useProductDetailSheet } from "@/src/context/ProductDetailSheetContext";

interface ProductCardOrderProps {
  product: Product;
  handleAddToCart: (item: CartItem) => void;
  handleRemoveFromCart: (productColorId: string, amount?: number) => void;
  cart: CartItem[];
}
function ProductCardOrder({
  product,
  handleAddToCart,
  handleRemoveFromCart,
  cart,
}: ProductCardOrderProps) {
  const { openById } = useProductDetailSheet();

  // color
  const [showMore, setShowMore] = useState(false);
  const displayLimit = 2;
  const hasMore = product.colors?.length > displayLimit;
  const visibleColors = product.colors?.slice(0, displayLimit);
  const remainingColors = product.colors?.slice(displayLimit);
  //end color

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const selectedColor = product.colors?.[selectedColorIndex];

  const cartItem = cart.find((i) => i.productColorId === selectedColor?.id);
  const quantity = cartItem?.quantity || 1;

  const [inputValue, setInputValue] = useState<string | null>(null);

  const image = selectedColor.imageUrl;

  if (!selectedColor) return null;

  return (
    <div
      className="group rounded-xl border border-gray-100 bg-white p-4 cursor-pointer
  shadow-[0_3px_10px_rgb(0,0,0,0.1)] 
  hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
  transition-all duration-300 
  flex flex-col h-full"
      onClick={() => openById(product.id)}
    >
      {/* Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
          />
        )}

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
                {selectedColor?.sku}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Chất liệu</span>
              <span className="font-medium text-gray-900">
                {product?.material}
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
      {/*info */}
      <div className="flex flex-col gap-0.5">
        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
          {product.name}
        </h3>
        <div className="flex justify-between items-start">
          {/* Base price nếu cần */}
          <p className="text-sm text-gray-600 mb-2">
            {selectedColor?.price.toLocaleString()}đ
          </p>
          <div className="flex items-center gap-2">
            {/* Hiển thị 3 màu đầu tiên */}
            {visibleColors.map((color, index) => (
              <button
                key={color.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIndex(index);
                }}
                className={`w-5 h-5 rounded-full border transition-all duration-300 transform hover:scale-110 ${
                  selectedColorIndex === index
                    ? "border-gray-500 scale-110"
                    : "border-transparent"
                }`}
                style={{
                  backgroundColor: color.hexcode,
                  boxShadow:
                    "inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 6px rgba(0,0,0,0.1)",
                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)`,
                }}
              />
            ))}

            {/* Nút + hiển thị số lượng còn lại */}
            {hasMore && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMore(!showMore);
                  }}
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
                            backgroundColor: color.hexcode,
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
      {/* 3. Nút Add to Cart mới thêm vào */}
      <div className="mt-auto pt-2">
        {!cartItem ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart({
                productColorId: selectedColor.id,
                quantity: 1,
                name: product.name,
                image: selectedColor.imageUrl,
                categoryName: product.productCategoryName,
                colorName: selectedColor?.colorName || "",
                hexcode: selectedColor.hexcode,
                sku: selectedColor.sku,
                price: selectedColor.price,
              });
            }}
            className="w-full bg-gray-900 hover:bg-blue-600 text-white"
          >
            Thêm vào giỏ hàng
          </Button>
        ) : (
          <div
            className="flex items-center justify-between border rounded-lg px-2 py-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleRemoveFromCart(selectedColor.id)}
            >
              -
            </Button>
            {/* Input */}
            <input
              type="text"
              inputMode="numeric"
              value={inputValue ?? quantity.toString()}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();

                const val = e.target.value;

                if (!/^\d*$/.test(val)) return;

                setInputValue(val);
              }}
              onBlur={() => {
                const value = Number(inputValue);

                if (!value || value <= 0) {
                  setInputValue(null);
                  return;
                }

                const diff = value - quantity;

                if (diff > 0) {
                  handleAddToCart({
                    productColorId: selectedColor.id,
                    quantity: diff,
                    name: product.name,
                    categoryName: product.productCategoryName,
                    image: selectedColor.imageUrl,
                    colorName: selectedColor?.colorName || "",
                    hexcode: selectedColor.hexcode,
                    sku: selectedColor.sku,
                    price: selectedColor.price,
                  });
                } else if (diff < 0) {
                  handleRemoveFromCart(selectedColor.id, Math.abs(diff)); // ✅
                }

                setInputValue(null); // 🔥 QUAN TRỌNG
              }}
              className="w-10 text-center outline-none bg-transparent text-sm font-medium"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                handleAddToCart({
                  productColorId: selectedColor.id,
                  quantity: 1,
                  name: product.name,
                  categoryName: product.productCategoryName,
                  image: selectedColor.imageUrl,
                  colorName: selectedColor?.colorName || "",
                  hexcode: selectedColor.hexcode,
                  sku: selectedColor.sku,
                  price: selectedColor.price,
                })
              }
            >
              +
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCardOrder;
