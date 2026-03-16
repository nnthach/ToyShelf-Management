import React, { useEffect, useState } from "react";
import { Input } from "@/src/styles/components/ui/input";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import { Separator } from "@/src/styles/components/ui/separator";
import { Checkbox } from "@/src/styles/components/ui/checkbox";
import { QueryParams } from "@/src/types/SubType";
import { Button } from "@/src/styles/components/ui/button";

interface SidebarFilterProps {
  query: QueryParams;
  updateQuery: (updates: Partial<QueryParams>) => void;
  resetQuery: () => void;
  onApply?: () => void;
}

export default function SidebarFilter({
  query,
  updateQuery,
  resetQuery,
  onApply,
}: SidebarFilterProps) {
  const [tempQuery, setTempQuery] = useState<QueryParams>(query);

  useEffect(() => {
    setTempQuery(query);
  }, [query]);

  const handleUpdateTemp = (updates: Partial<QueryParams>) => {
    setTempQuery((prev) => ({ ...prev, ...updates }));
  };

  const handleApply = () => {
    updateQuery(tempQuery); // Lúc này mới thực sự trigger API/URL
    if (onApply) onApply();
  };

  const handleClear = () => {
    const emptyQuery = {
      search: "",
      brand: "",
      order: "",
      isActive: undefined,
    };
    setTempQuery(emptyQuery);
    updateQuery(emptyQuery); // Clear thì thường sẽ thực hiện ngay
  };

  return (
    <aside className="w-full h-full flex flex-col bg-card border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Bộ lọc</h2>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-6">
          {/* Brand (Dùng tempQuery) */}
          <div>
            <h3 className="mb-2 font-medium text-sm">Thương hiệu</h3>
            <div className="space-y-2">
              {["Apple", "Samsung", "Sony"].map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-${brand}`}
                    checked={tempQuery.brand === brand}
                    onCheckedChange={() => handleUpdateTemp({ brand })}
                  />
                  <label
                    htmlFor={`filter-${brand}`}
                    className="text-sm cursor-pointer"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* FOOTER CỐ ĐỊNH */}
      <div className="p-4 border-t bg-card grid grid-cols-2 gap-3 mt-auto">
        <Button variant="outline" onClick={handleClear}>
          Xóa
        </Button>
        <Button onClick={handleApply}>Áp dụng</Button>
      </div>
    </aside>
  );
}
