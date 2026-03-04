import { Button } from "@/src/styles/components/ui/button";
import { Download, Eye, Upload } from "lucide-react";
import ProductCardSkeleton from "@/src/components/ProductCardSkeleton";
import { Product } from "@/src/types";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { useState } from "react";
import ProductCard from "./ProductCard";

interface ProductGridViewProps {
  productList: Product[];
  isLoading: boolean;
  children: React.ReactNode;
  handleViewDetail: (productId: string) => void;
}

function ProductGridView({
  productList,
  isLoading,
  children,
  handleViewDetail,
}: ProductGridViewProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-4 p-4 border-b flex justify-between items-center bg-white dark:bg-sidebar rounded-xl">
        {children}
        <div className="space-x-3">
          <Button>
            <Download /> Nhập dữ liệu
          </Button>
          <Button variant={"outline"}>
            <Upload />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : productList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                handleViewDetail={handleViewDetail}
              />
            ))}
      </div>
    </div>
  );
}

export default ProductGridView;
