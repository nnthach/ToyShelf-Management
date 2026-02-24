"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/styles/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import CabinetFormSheet from "./CabinetFormSheet";
import { getCabinDetailAPI } from "@/src/services/shelf.service";

type ViewDetailSheetProps = {
  cabinetId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

function ViewDetailSheet({ cabinetId, isOpen, onClose }: ViewDetailSheetProps) {
  const router = useRouter();

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
            <h1 className="text-xl">Cabin</h1>
          </SheetTitle>
        </SheetHeader>
        <div className="flex bg-gray-200 dark:bg-muted h-full">
          {/*Left */}
          <div className="w-[70%] p-4">{/* Tabs content */}</div>

          {/*Right */}
          <CabinetFormSheet cabinet={cabinetDetail} onClose={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
