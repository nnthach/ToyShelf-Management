"use client";

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

import { useState } from "react";
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
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
