import React from "react";
import { Input } from "@/src/styles/components/ui/input";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import { Separator } from "@/src/styles/components/ui/separator";
import { Checkbox } from "@/src/styles/components/ui/checkbox";
import { QueryParams } from "@/src/types/SubType";

interface SidebarFilterProps {
  query: QueryParams;
  updateQuery: (updates: Partial<QueryParams>) => void;
  resetQuery: () => void;
}

export default function SidebarFilter({
  query,
  updateQuery,
  resetQuery,
}: SidebarFilterProps) {
  return (
    <aside className="w-64 border-r flex flex-col bg-card shrink-0">
      <div className="p-6">
        <h2 className="text-lg font-semibold tracking-tight">Bộ lọc</h2>
        <p className="text-sm text-muted-foreground">Tối ưu tìm kiếm của bạn</p>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-6">
          {/* Search Section */}
          <div>
            <h3 className="mb-2 font-medium text-sm">Tìm kiếm</h3>
            <Input
              placeholder="Tên sản phẩm..."
              value={query.search || ""}
              onChange={(e) => updateQuery({ search: e.target.value })}
            />
          </div>

          {/* Brand Filter */}
          <div>
            <h3 className="mb-2 font-medium text-sm">Thương hiệu</h3>
            <div className="space-y-2">
              {["Apple", "Samsung", "Sony"].map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={query.brand === brand}
                    onCheckedChange={() => updateQuery({ brand: brand })}
                  />
                  <label
                    htmlFor={brand}
                    className="text-sm leading-none cursor-pointer hover:text-primary"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 mt-auto border-t">
        <button
          onClick={resetQuery}
          className="w-full py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors underline-offset-4 hover:underline"
        >
          Xóa tất cả bộ lọc
        </button>
      </div>
    </aside>
  );
}
