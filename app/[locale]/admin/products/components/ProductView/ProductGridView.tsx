import FilterSearchBar from "@/shared/components/FilterSearchBar";
import { Button } from "@/shared/styles/components/ui/button";
import { Product } from "@/shared/types";
import { QueryParams } from "@/shared/types/SubType";
import { Download, Eye, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";
import ViewDetailSheet from "../ViewDetailSheet";
import ProductCardSkeleton from "@/shared/components/ProductCardSkeleton";
import { ProductStatus } from "@/shared/enums/product-status.enum";
import { PRODUCT_STATUS_OPTIONS } from "@/shared/constants/product-status";

interface ProductGridViewProps {
  productList: Product[];
  isLoading: boolean;
  tempFilter: {
    order: string;
    status: string;
    limit: number;
  };
  handleChangeFilter: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleLimitChange: (value: number) => void;
  handleApplyFilters: () => void;
  query: QueryParams;
  updateQuery: (newQuery: Partial<QueryParams>) => void;
  handleResetAllQueryParams: () => void;
}

function ProductGridView({
  productList,
  isLoading,
  tempFilter,
  handleChangeFilter,
  handleLimitChange,
  handleApplyFilters,
  query,
  updateQuery,
  handleResetAllQueryParams,
}: ProductGridViewProps) {
  const tStatus = useTranslations("status.products");
  const tButton = useTranslations("admin.button");

  const statusOptions = PRODUCT_STATUS_OPTIONS.map((status) => ({
    value: status.value,
    label: tStatus(status.label),
  }));

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4 p-4 border-b flex justify-between items-center bg-white dark:bg-sidebar rounded-xl">
        <FilterSearchBar
          tempFilter={tempFilter}
          onFilterChange={handleChangeFilter}
          onLimitChange={handleLimitChange}
          onApplyFilters={handleApplyFilters}
          query={{ search: query.search || "" }}
          updateQuery={updateQuery}
          selectStatusData={statusOptions}
          reset={handleResetAllQueryParams}
        />
        <div className="space-x-3">
          <Button>
            <Download /> {tButton("import")}
          </Button>
          <Button variant={"outline"}>
            <Upload /> {tButton("export")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: tempFilter.limit || 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : productList.map((product) => {
              const image = product.images?.[0];

              return (
                <div
                  key={product.id}
                  className="group rounded-xl border border-gray-200 bg-white p-4
               hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Image */}
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-2">
                    <div className="aspect-square">
                      {image && (
                        <img
                          src={image}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Eye button */}
                    <ViewDetailSheet product={product}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 z-20
               opacity-0 group-hover:opacity-100 transition"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </ViewDetailSheet>

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
                            {product.sku}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Price</span>
                          <span className="font-medium text-gray-900">
                            ${product.price}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Category</span>
                          <span className="font-medium text-gray-900 truncate">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-2">
                    <span
                      className="inline-flex items-center gap-1 rounded-full
                       bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      Published
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {product.title}
                  </h3>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default ProductGridView;
