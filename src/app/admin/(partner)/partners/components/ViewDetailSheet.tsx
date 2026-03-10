"use client";

import { Card, CardHeader, CardTitle } from "@/src/styles/components/ui/card";
import { ScrollArea } from "@/src/styles/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/styles/components/ui/sheet";
import { DollarSign, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getPartnerDetailAPI } from "@/src/services/partner.service";

import PartnerFormSheet from "./PartnerFormSheet";
import { Button } from "@/src/styles/components/ui/button";
import CreatePartnerAccountModal from "../[id]/components/CreatePartnerAccountModal";

type ViewDetailSheetProps = {
  partnerId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

function ViewDetailSheet({ partnerId, isOpen, onClose }: ViewDetailSheetProps) {
  const { data: partnerDetail, isLoading } = useQuery({
    queryKey: ["partner", partnerId],
    queryFn: () => getPartnerDetailAPI(partnerId!),
    select: (res) => res.data,
    enabled: !!partnerId,
  });

  if (!partnerId) return null;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <SheetContent className="w-full !max-w-[1200px]">
        <SheetHeader>
          <SheetTitle>Thông tin đối tác</SheetTitle>
          <SheetDescription>
            Thông tin về {partnerDetail?.companyName}
          </SheetDescription>
        </SheetHeader>
        <div className="flex bg-gray-200 dark:bg-muted h-full">
          {/*Left */}
          <div className="w-[70%] p-4">
            {/*Thong tin doi tac */}
            <div>
              <CreatePartnerAccountModal />
            </div>
          </div>

          {/*Right */}
          <PartnerFormSheet partner={partnerDetail} onClose={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
