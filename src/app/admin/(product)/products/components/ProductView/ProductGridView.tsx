import { Button } from "@/src/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import ProductCardSkeleton from "@/src/components/ProductCardSkeleton";
import { Product } from "@/src/types";
import ProductCard from "./ProductCard";
import { memo } from "react";
import Pagination from "@/src/components/Pagination";
import { QueryParams } from "@/src/types/SubType";

interface ProductGridViewProps {
  productList: Product[];
  isLoading: boolean;
  children: React.ReactNode;
  handleViewDetail: (productId: string) => void;
  query: QueryParams;
  updateQuery: (val: Partial<QueryParams>) => void;
  totalItems: number;
  totalPages: number;
}

function ProductGridView({
  productList,
  isLoading,
  children,
  handleViewDetail,
  query,
  updateQuery,
  totalItems,
  totalPages,
}: ProductGridViewProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="bg-white rounded-xl overflow-hidden ">
        <div className="mb-4 p-4 border-b flex justify-between items-center bg-white dark:bg-sidebar">
          {children}
        </div>
        <div className="px-4 pb-4">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : productList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
              {productList.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  handleViewDetail={handleViewDetail}
                />
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-300 text-lg font-medium">
              Không có sản phẩm nào
            </div>
          )}
        </div>

        <Pagination
          currentPage={query?.pageNumber || 1}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={query?.pageSize || 10}
          onPageChange={(page) => updateQuery({ pageNumber: page })}
        />
      </div>
    </div>
  );
}

export default memo(ProductGridView);
