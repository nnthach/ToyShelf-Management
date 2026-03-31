"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/styles/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getShelfTypeDetailAPI } from "@/src/services/shelf.service";

type ViewDetailSheetProps = {
  shelfTypeId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

function ViewDetailSheet({
  shelfTypeId,
  isOpen,
  onClose,
}: ViewDetailSheetProps) {
  const router = useRouter();

  const { data: shelfTypeDetail, isLoading } = useQuery({
    queryKey: ["shelfType", shelfTypeId],
    queryFn: () => getShelfTypeDetailAPI(shelfTypeId!),
    select: (res) => res.data,
    enabled: !!shelfTypeId,
  });

  if (!shelfTypeId) return null;

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
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
