"use client";

import { Edit, Trash2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/styles/components/ui/sheet";

import { Button } from "@/src/styles/components/ui/button";
import { Label } from "@/src/styles/components/ui/label";
import { Input } from "@/src/styles/components/ui/input";
import { Textarea } from "@/src/styles/components/ui/textarea";
import { useState } from "react";
import { TabButton } from "@/src/styles/components/custom/TabButton";
import { useRouter } from "next/navigation";
import { Store } from "@/src/types";

type LeftTab = "stats" | "3d" | "images";

const LEFT_TABS: { key: LeftTab; label: string }[] = [
  { key: "stats", label: "Thống kê" },
  { key: "3d", label: "Xem 3D" },
  { key: "images", label: "Hình ảnh" },
];

function ViewDetailSheet({
  store,
  children,
}: {
  store: Store;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LeftTab>("stats");

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full !max-w-[1200px]">
        <SheetHeader>
          <SheetTitle>Chi tiết cửa hàng</SheetTitle>
          <SheetDescription>
            Xem chi tiết thông tin cửa {store?.name}
          </SheetDescription>
        </SheetHeader>
        <div className="flex bg-gray-200 dark:bg-muted h-full">
          {/*Left */}
          <div className="w-[70%] p-4">{/* Tabs content */}</div>

          {/*Right */}
          <div className="bg-background flex-1 border-t border-border flex flex-col">
            <div className="grid flex-1 auto-rows-min gap-6 pb-2 px-4 mt-4 max-h-[85%] overflow-y-auto">
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-name">Tên sản phẩm</Label>
                <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-username">Mô tả</Label>
                <Textarea
                  id="sheet-demo-description"
                  defaultValue="@peduarte"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-brand">Thương hiệu</Label>
                <Input id="sheet-demo-brand" defaultValue="@peduarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-category">Danh mục</Label>
                <Input id="sheet-demo-category" defaultValue="@peduarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-price">Giá</Label>
                <Input id="sheet-demo-price" defaultValue="@peduarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-stock">Tồn kho</Label>
                <Input id="sheet-demo-stock" defaultValue="@peduarte" />
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-border px-4 py-3 mt-auto">
              <div className="flex items-center justify-between gap-2">
                <Button variant="outline" title="Xóa">
                  <Trash2 color="red" />
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  onClick={
                    () => router.push(`/admin/stores/edit/1`)
                    // router.push(`/admin/stores/edit/${product.id}`)
                  }
                >
                  <Edit />
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
