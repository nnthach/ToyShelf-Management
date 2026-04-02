"use client";

import React from "react";

import { Tag, Palette, Box } from "lucide-react";
import Image from "next/image";
import { useProductDetailSheet } from "@/src/context/ProductDetailSheetContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/styles/components/ui/card";

interface Product {
  id: string;
  name: string;
  categoryName: string;
  brand: string;
  SKU: string;
  colorName: string;
  price: number;
  imageUrl: string;
  totalSold: number;
}

// Dữ liệu giả lập theo Interface Product
const TOP_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Luffy Gear 5 Special Edition",
    categoryName: "Mô hình",
    brand: "Bandai",
    SKU: "OP-LFG5-01",
    colorName: "Trắng chân thật",
    price: 1250000,
    imageUrl:
      "https://res.cloudinary.com/dcbkhfbqs/image/upload/v1774937890/toyscabin/product/images/a7i3lwkuyf8qrhxgw79x.webp",
    totalSold: 1200,
  },
  {
    id: "2",
    name: "Zoro Wano Kuni",
    categoryName: "Mô hình",
    brand: "Banpresto",
    SKU: "OP-ZR-02",
    colorName: "Xanh lá",
    price: 850000,
    imageUrl:
      "https://res.cloudinary.com/dcbkhfbqs/image/upload/v1774937890/toyscabin/product/images/a7i3lwkuyf8qrhxgw79x.webp",
    totalSold: 980,
  },
  {
    id: "3",
    name: "Nami Onigashima",
    categoryName: "Mô hình",
    brand: "Megahouse",
    SKU: "OP-NM-03",
    colorName: "Cam rực rỡ",
    price: 2100000,
    imageUrl:
      "https://res.cloudinary.com/dcbkhfbqs/image/upload/v1774937890/toyscabin/product/images/a7i3lwkuyf8qrhxgw79x.webp",
    totalSold: 870,
  },
];

const TopThreeProduct = () => {
  const { openById } = useProductDetailSheet();
  return (
    <Card className="border-none shadow-none bg-transparent w-full h-full py-0 gap-2">
      <CardHeader className="p-0 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-bold flex items-center gap-2 uppercase tracking-tight">
          <Box className="w-5 h-5 text-blue-500" />
          Sản phẩm bán chạy nhất
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-1 flex-col justify-between gap-3">
        {TOP_PRODUCTS.map((product, index) => (
          <div
            key={product.id}
            onClick={() => openById(product.id)}
            className={`
              group relative cursor-pointer p-2 flex gap-4 rounded-2xl border border-transparent transition-all hover:border-blue-100 hover:shadow-sm
              ${
                index === 0
                  ? "bg-yellow-100 border-yellow-100/50"
                  : index === 1
                    ? "bg-slate-100"
                    : index === 2
                      ? "bg-orange-100 border-orange-100/50"
                      : "bg-white"
              }
            `}
          >
            {/* Ảnh sản phẩm + Rank Badge */}
            <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border bg-white shadow-inner flex items-center justify-center">
              <Image
                src={product.imageUrl || "/images/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div
                className={`
    absolute top-0 left-0 px-1.5 py-0.5 text-[10px] font-black rounded-br-lg shadow-sm z-10
    ${index === 0 ? "bg-yellow-400 text-white" : "bg-slate-800 text-white"}
    `}
              >
                #{index + 1}
              </div>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <h4 className="text-[14px] font-bold text-gray-900 line-clamp-1 leading-tight group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h4>

                <p className="text-[10px] font-mono font-medium text-slate-500 shrink-0 uppercase mt-1">
                  #{product.SKU}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-gray-100 text-[10px] font-medium text-gray-500 uppercase tracking-tighter">
                    <Tag size={10} className="text-blue-500" />
                    {product.brand}
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-gray-100 text-[10px] font-medium text-gray-500 uppercase tracking-tighter">
                    <Palette size={10} className="text-purple-500" />
                    {product.colorName}
                  </div>
                </div>
              </div>

              {/* Stats bên dưới */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-200">
                <div className="flex items-center gap-1.5">
                  <Box size={14} className="text-blue-600" />
                  <span className="text-[14px] font-bold text-slate-900">
                    {product.totalSold.toLocaleString()}
                    <span className="text-[12px] font-normal text-slate-500 ml-1 italic">
                      đã bán
                    </span>
                  </span>
                </div>
                <div className="text-[14px] font-semibold text-emerald-600">
                  {product.price.toLocaleString()}đ
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopThreeProduct;
