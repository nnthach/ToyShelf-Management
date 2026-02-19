import { Button } from "@/src/styles/components/ui/button";
import { Cabinet } from "@/src/types";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";

import { useQueryClient } from "@tanstack/react-query";
import { Edit, Lock, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

type CabinetFormSheetProps = {
  cabinet: Cabinet;
  onClose: () => void;
};
function CabinetFormSheet({ cabinet, onClose }: CabinetFormSheetProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <div className="bg-background flex-1 border-t border-border">
      <div className="flex flex-col divide-y divide-border overflow-y-auto h-[85%]">
        {/* name */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Tên kệ</p>
          <p className="text-base font-bold">{cabinet?.name}</p>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Trậng thái
          </p>
          <span
            className={`${formatUserStatusColor(cabinet?.isActive)} text-base font-bold pb-1`}
          >
            {formatUserStatusText(cabinet?.isActive)}
          </span>
        </div>

        {/* sku */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Mã kệ</p>
          <p className="text-base font-bold">{cabinet?.code}</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-border px-4 py-3 mt-8">
        <div className="flex items-center gap-2">
          =
          <Button
            className="flex-1"
            onClick={() => router.push(`/admin/cabinets/edit/${cabinet.id}`)}
          >
            <Edit />
            Chỉnh sửa
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(CabinetFormSheet);
