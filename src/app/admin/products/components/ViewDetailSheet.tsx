"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/styles/components/ui/sheet";

import { useMemo, useState } from "react";
import { TabButton } from "@/src/styles/components/custom/TabButton";
import ProductStatistics from "./ViewDetailComponents/ProductStatistics";
import ProductThreeD from "./ViewDetailComponents/ProductThreeD";
import ProductImage from "./ViewDetailComponents/ProductImage";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ProductFormSheet from "./ProductFormSheet";
import { getProductDetailAPI } from "@/src/services/product.service";

type LeftTab = "stats" | "3d" | "images";

const LEFT_TABS: { key: LeftTab; label: string }[] = [
  { key: "stats", label: "Statistics" },
  { key: "3d", label: "3D View" },
  { key: "images", label: "Images" },
];
type ViewDetailSheetProps = {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

function ViewDetailSheet({ productId, isOpen, onClose }: ViewDetailSheetProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LeftTab>("stats");

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

  const { data: productDetail, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductDetailAPI(productId!),
    select: (res) => res.data,
    enabled: !!productId,
  });

  if (!productId) return null;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <SheetContent className="w-full !max-w-[1200px]">
        <SheetHeader className="pb-0">
          <SheetTitle className="">
            <h1 className="text-xl">Thông tin sản phẩm</h1>

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
          <ProductFormSheet product={productDetail} onClose={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
