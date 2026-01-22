"use client";

import { Edit, Eye, Trash2 } from "lucide-react";
import { Product } from "@/shared/types";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/styles/components/ui/sheet";

import { Button } from "@/shared/styles/components/ui/button";
import { Label } from "@/shared/styles/components/ui/label";
import { Input } from "@/shared/styles/components/ui/input";
import { Textarea } from "@/shared/styles/components/ui/textarea";
import { useMemo, useState } from "react";
import { TabButton } from "@/shared/styles/components/custom/TabButton";
import ProductStatistics from "./ViewDetailComponents/ProductStatistics";
import ProductThreeD from "./ViewDetailComponents/ProductThreeD";
import ProductImage from "./ViewDetailComponents/ProductImage";
import { useRouter } from "next/navigation";

type LeftTab = "stats" | "3d" | "images";

const LEFT_TABS: { key: LeftTab; label: string }[] = [
  { key: "stats", label: "Statistics" },
  { key: "3d", label: "3D View" },
  { key: "images", label: "Images" },
];

function ViewDetailSheet({
  product,
  children,
}: {
  product: Product;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LeftTab>("stats");

  const tViewDetailSheet = useTranslations("admin.products.viewDetailSheet");
  const tColumnTable = useTranslations("admin.tableColumn");
  const tButton = useTranslations("admin.button");

  const renderLeftContent = useMemo(() => {
    switch (activeTab) {
      case "stats":
        return <ProductStatistics />;

      case "3d":
        return <ProductThreeD />;

      case "images":
        return <ProductImage />;

      default:
        return <ProductStatistics />;
    }
  }, [activeTab]);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full !max-w-[1200px]">
        <SheetHeader className="pb-0">
          <SheetTitle className="">
            <h1 className="text-xl">{tViewDetailSheet("header")}</h1>

            {/* Tabs ở header */}
            <div className="flex gap-1 mt-2">
              {LEFT_TABS.map((tab) => (
                <TabButton
                  key={tab.key}
                  active={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </TabButton>
              ))}
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex bg-gray-200 dark:bg-muted h-full">
          {/*Left */}
          <div className="w-[70%] p-4">
            {/* Tabs content */}
            {renderLeftContent}
          </div>

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
                    () => router.push(`/admin/products/edit/1`)
                    // router.push(`/admin/products/edit/${product.id}`)
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
