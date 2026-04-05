import { Button } from "@/src/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import ProductCardSkeleton from "@/src/components/ProductCardSkeleton";
import { Shelf } from "@/src/types";
import { memo } from "react";
import Pagination from "@/src/components/Pagination";
import { QueryParams } from "@/src/types/SubType";
import ShelfCard from "./ShelfCard";

interface ShelfGridViewProps {
  shelfList: Shelf[];
  isLoading: boolean;
  children: React.ReactNode;
  handleViewDetail: (shelfId: string) => void;
  query: QueryParams;
  updateQuery: (val: Partial<QueryParams>) => void;
  totalItems: number;
  totalPages: number;
}

function ShelfGridView({
  shelfList,
  isLoading,
  children,
  handleViewDetail,
  query,
  updateQuery,
  totalItems,
  totalPages,
}: ShelfGridViewProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="bg-white rounded-xl overflow-hidden ">
        <div className="mb-4 p-4 border-b flex justify-between items-center bg-white dark:bg-sidebar">
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
        <div className="px-4 pb-4">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : shelfList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4">
              {shelfList.map((shelf) => (
                <ShelfCard
                  key={shelf.id}
                  shelf={shelf}
                  handleViewDetail={handleViewDetail}
                />
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-300 text-lg font-medium">
              Không có kệ nào
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

export default memo(ShelfGridView);
