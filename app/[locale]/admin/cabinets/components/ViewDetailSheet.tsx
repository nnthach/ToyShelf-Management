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

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductDetailAPI } from "@/shared/services/product.service";
import ProductFormSheet from "./CabinetFormSheet";
import { getCabinDetailAPI } from "@/shared/services/cabinet.service";
import CabinetFormSheet from "./CabinetFormSheet";

type ViewDetailSheetProps = {
  cabinetId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

function ViewDetailSheet({ cabinetId, isOpen, onClose }: ViewDetailSheetProps) {
  const router = useRouter();

  const tViewDetailSheet = useTranslations("admin.products.viewDetailSheet");
  const tColumnTable = useTranslations("admin.tableColumn");
  const tButton = useTranslations("admin.button");

  const { data: cabinetDetail, isLoading } = useQuery({
    queryKey: ["cabinet", cabinetId],
    queryFn: () => getCabinDetailAPI(cabinetId!),
    select: (res) => res.data,
    enabled: !!cabinetId,
  });

  if (!cabinetId) return null;

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
            <h1 className="text-xl">{tViewDetailSheet("header")}</h1>
          </SheetTitle>
        </SheetHeader>
        <div className="flex bg-gray-200 dark:bg-muted h-full">
          {/*Left */}
          <div className="w-[70%] p-4">
            {/* Tabs content */}
          </div>

          {/*Right */}
          <CabinetFormSheet cabinet={cabinetDetail} onClose={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
