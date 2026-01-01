"use client";

import { Edit, Trash2 } from "lucide-react";
import { Store } from "@/shared/types";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/styles/components/ui/sheet";

import { Button } from "@/shared/styles/components/ui/button";
import { Label } from "@/shared/styles/components/ui/label";
import { Input } from "@/shared/styles/components/ui/input";
import { Textarea } from "@/shared/styles/components/ui/textarea";
import { useState } from "react";
import { TabButton } from "@/shared/styles/components/custom/TabButton";
import { useRouter } from "next/navigation";

type LeftTab = "stats" | "3d" | "images";

const LEFT_TABS: { key: LeftTab; label: string }[] = [
  { key: "stats", label: "Statistics" },
  { key: "3d", label: "3D View" },
  { key: "images", label: "Images" },
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

  const tViewDetailSheet = useTranslations("admin.stores.viewDetailSheet");
  const tColumnTable = useTranslations("admin.tableColumn");
  const tButton = useTranslations("admin.button");

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full !max-w-[1200px]">
        <SheetHeader>
          <SheetTitle>{tViewDetailSheet("header")}</SheetTitle>
          <SheetDescription>
            {tViewDetailSheet("subHeader")} {store?.name}
          </SheetDescription>
        </SheetHeader>
        <div className="flex bg-gray-200 dark:bg-muted h-full">
          {/*Left */}
          <div className="w-[70%] p-4">{/* Tabs content */}</div>

          {/*Right */}
          <div className="bg-background flex-1 border-t border-border flex flex-col">
            <div className="grid flex-1 auto-rows-min gap-6 pb-2 px-4 mt-4 max-h-[85%] overflow-y-auto">
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-name">
                  {tColumnTable("productName")}
                </Label>
                <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-username">
                  {tColumnTable("description")}
                </Label>
                <Textarea
                  id="sheet-demo-description"
                  defaultValue="@peduarte"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-brand">
                  {tColumnTable("brand")}
                </Label>
                <Input id="sheet-demo-brand" defaultValue="@peduarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-category">
                  {tColumnTable("category")}
                </Label>
                <Input id="sheet-demo-category" defaultValue="@peduarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-price">
                  {tColumnTable("price")}
                </Label>
                <Input id="sheet-demo-price" defaultValue="@peduarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sheet-demo-stock">
                  {tColumnTable("stock")}
                </Label>
                <Input id="sheet-demo-stock" defaultValue="@peduarte" />
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-border px-4 py-3 mt-auto">
              <div className="flex items-center justify-between gap-2">
                <Button variant="outline" title={tButton("delete")}>
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
                  {tButton("edit")}
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
