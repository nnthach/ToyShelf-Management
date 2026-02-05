import {
  deleteProductAPI,
  disableProductAPI,
  restoreProductAPI,
} from "@/shared/services/product.service";
import { Button } from "@/shared/styles/components/ui/button";
import { Cabinet, Product } from "@/shared/types";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/shared/utils/formatStatus";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Lock, RotateCcw, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { Form } from "react-hook-form";
import { toast } from "react-toastify";
import { useTranslations } from "use-intl";

type CabinetFormSheetProps = {
  cabinet: Cabinet;
  onClose: () => void;
};
function CabinetFormSheet({ cabinet, onClose }: CabinetFormSheetProps) {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const router = useRouter();
  const tButton = useTranslations("admin.button");
  const tButtonCommon = useTranslations("button");
  const tStatus = useTranslations("status.isActive");
  const tColumnTable = useTranslations("admin.tableColumn");

  // async function handleDisable() {
  //   try {
  //     await disableProductAPI(product.id!);

  //     queryClient.invalidateQueries({
  //       queryKey: ["products"],
  //     });

  //     await queryClient.invalidateQueries({
  //       queryKey: ["product", product.id],
  //     });

  //     toast.success(
  //       locale === "vi"
  //         ? "Vô hiệu hóa sản phẩm thành công"
  //         : "Disable product successfully!",
  //     );
  //   } catch (error) {
  //     console.log("Disable product err", error);
  //     toast.error(
  //       locale === "vi"
  //         ? "Vô hiệu hóa sản phẩm thất bại"
  //         : "Failed to disable product",
  //     );
  //   }
  // }

  // async function handleRestore() {
  //   try {
  //     await restoreProductAPI(product.id!);

  //     queryClient.invalidateQueries({
  //       queryKey: ["products"],
  //     });

  //     await queryClient.invalidateQueries({
  //       queryKey: ["product", product.id],
  //     });

  //     toast.success(
  //       locale === "vi"
  //         ? "Khôi phục sản phẩm thành công"
  //         : "Restore product successfully!",
  //     );
  //   } catch (error) {
  //     console.log("Restore product err", error);
  //     toast.error(
  //       locale === "vi"
  //         ? "Khôi phục sản phẩm thất bại"
  //         : "Failed to restore product",
  //     );
  //   }
  // }

  // async function handleDelete() {
  //   try {
  //     await deleteProductAPI(product.id!);

  //     queryClient.invalidateQueries({
  //       queryKey: ["products"],
  //     });

  //     onClose();
  //     toast.success(
  //       locale === "vi"
  //         ? "Xóa sản phẩm thành công"
  //         : "Delete product successfully!",
  //     );
  //   } catch (error) {
  //     console.log("Delete product err", error);
  //     toast.error(
  //       locale === "vi" ? "Xóa sản phẩm thất bại" : "Failed to delete product",
  //     );
  //   }
  // }

  return (
    <div className="bg-background flex-1 border-t border-border">
      <div className="flex flex-col divide-y divide-border overflow-y-auto h-[85%]">
        {/* name */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {tColumnTable("productName")}
          </p>
          <p className="text-base font-bold">{cabinet?.name}</p>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {tColumnTable("status")}
          </p>
          <span
            className={`${formatUserStatusColor(cabinet?.isActive)} text-base font-bold pb-1`}
          >
            {tStatus(formatUserStatusText(cabinet?.isActive))}
          </span>
        </div>

        {/* sku */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {tColumnTable("sku")}
          </p>
          <p className="text-base font-bold">{cabinet?.code}</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-border px-4 py-3 mt-8">
        <div className="flex items-center gap-2">
          {cabinet?.isActive ? (
            <Button
              variant="outline"
              title={tButtonCommon("disable")}
              // onClick={() => handleDisable()}
            >
              <Lock color="red" />
            </Button>
          ) : (
            <div>
              <Button
                variant="outline"
                title={tButtonCommon("delete")}
                // onClick={() => handleDelete()}
              >
                <Trash2 color="red" />
              </Button>

              <Button
                variant="outline"
                title={tButtonCommon("restore")}
                // onClick={() => handleRestore()}
              >
                <RotateCcw color="aqua" />
              </Button>
            </div>
          )}
          <Button
            className="flex-1"
            onClick={() => router.push(`/admin/cabinets/edit/${cabinet.id}`)}
          >
            <Edit />
            {tButton("edit")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(CabinetFormSheet);
