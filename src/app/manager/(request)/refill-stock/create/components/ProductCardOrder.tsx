import { Button } from "@/src/styles/components/ui/button";
import { Product } from "@/src/types";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CartItem } from "../page";

interface ProductCardOrderProps {
  product: Product;
  handleViewDetail: (productId: string) => void;
  handleAddToCart: (item: CartItem) => void;
  handleRemoveFromCart: (productColorId: string) => void;
  cart: CartItem[];
}
function ProductCardOrder({
  product,
  handleViewDetail,
  handleAddToCart,
  handleRemoveFromCart,
  cart,
}: ProductCardOrderProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const selectedColor = product.colors?.[selectedColorIndex];

  if (!selectedColor) return null;

  const cartItem = cart.find((i) => i.productColorId === selectedColor.id);

  const image = selectedColor?.imageUrl;

  return (
    <div className="group rounded-xl border border-gray-100 bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
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
      <div className="flex justify-between items-start">
        <div>
          {/* Name */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          {/* Base price nếu cần */}
          <p className="text-sm text-gray-600 mb-2">
            {selectedColor?.price.toLocaleString()}đ
          </p>
        </div>
        {/* Color selector */}
        <div className="flex items-center gap-2">
          {product.colors?.map((color, index) => (
            <button
              key={color.id}
              onClick={() => setSelectedColorIndex(index)}
              className="w-5 h-5 rounded-full border-2 transition"
              style={{ backgroundColor: color.hexcode }}
            />
          ))}
        </div>
      </div>

      {/* 3. Nút Add to Cart mới thêm vào */}
      <div className="mt-2">
        {!cartItem ? (
          <Button
            onClick={() =>
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
              })
            }
            className="w-full bg-gray-900 hover:bg-blue-600 text-white"
          >
            Thêm vào giỏ hàng
          </Button>
        ) : (
          <div className="flex items-center justify-between border rounded-lg px-2 py-1">
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleRemoveFromCart(selectedColor.id)}
            >
              -
            </Button>

            <span className="font-medium">{cartItem.quantity}</span>

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
