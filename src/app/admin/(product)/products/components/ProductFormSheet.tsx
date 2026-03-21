import {
  deleteProductAPI,
  disableProductAPI,
  restoreProductAPI,
} from "@/src/services/product.service";
import { Button } from "@/src/styles/components/ui/button";
import { Product } from "@/src/types";
import {
  formatUserStatusColor,
  formatUserStatusText,
} from "@/src/utils/formatStatus";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Lock, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { toast } from "react-toastify";

type ProductFormSheetProps = {
  product: Product;
  onClose: () => void;
};
function ProductFormSheet({ product, onClose }: ProductFormSheetProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  async function handleDisable() {
    try {
      await disableProductAPI(product.id!);

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["product", product.id],
      });

      toast.success("Vô hiệu hóa sản phẩm thành công");
    } catch (error) {
      toast.error("Vô hiệu hóa sản phẩm thất bại");
    }
  }

  async function handleRestore() {
    try {
      await restoreProductAPI(product.id!);

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["product", product.id],
      });

      toast.success("Khôi phục sản phẩm thành công");
    } catch (error) {
      toast.error("Khôi phục sản phẩm thất bại");
    }
  }

  async function handleDelete() {
    try {
      await deleteProductAPI(product.id!);

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      onClose();
      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      toast.error("Xóa sản phẩm thất bại");
    }
  }

  return (
    <div className="bg-background flex-1 border-t border-border">
      <div className="flex flex-col divide-y divide-border overflow-y-auto max-h-[75%]">
        {/* name */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tên sản phẩm
          </p>
          <p className="text-base font-bold">{product?.name}</p>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Trạng thái
          </p>
          <span
            className={`${formatUserStatusColor(product?.isActive)} text-base font-bold pb-1`}
          >
            {formatUserStatusText(product?.isActive)}
          </span>
        </div>

        {/* sku */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Mã SKU</p>
          <p className="text-base font-bold">{product?.sku}</p>
        </div>

        {/* price */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Gía</p>
          <p className="text-base font-bold">{product?.basePrice}</p>
        </div>
        {/* brand */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Hãng</p>
          <p className="text-base font-bold">{product?.brand}</p>
        </div>
        {/* material */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Chất liệu</p>
          <p className="text-base font-bold">{product?.material}</p>
        </div>
        {/* originCountry */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Xuất sứ</p>
          <p className="text-base font-bold">{product?.originCountry}</p>
        </div>
        {/* ageRange */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Độ tuổi</p>
          <p className="text-base font-bold">{product?.ageRange}</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-border px-4 py-3 mt-8">
        <div className="flex items-center gap-2">
          {product?.isActive ? (
            <Button
              variant="outline"
              title="Vô hiệu hóa"
              onClick={() => handleDisable()}
            >
              <Lock color="red" />
            </Button>
          ) : (
            <div>
              <Button
                variant="outline"
                title="Xóa"
                onClick={() => handleDelete()}
              >
                <Trash2 color="red" />
              </Button>

              <Button
                variant="outline"
                title="khôi phục"
                onClick={() => handleRestore()}
              >
                <RotateCcw color="aqua" />
              </Button>
            </div>
          )}
          <Button
            className="flex-1"
            onClick={() => router.push(`/admin/products/edit/${product.id}`)}
          >
            <Edit />
            Chỉnh sửa
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductFormSheet);
