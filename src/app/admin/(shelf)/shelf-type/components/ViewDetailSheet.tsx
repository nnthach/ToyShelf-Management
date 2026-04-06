"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/styles/components/ui/sheet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteShelfTypeAPI,
  disableShelfTypeAPI,
  getShelfTypeDetailAPI,
  restoreShelfTypeAPI,
} from "@/src/services/shelf.service";
import Image from "next/image";
import {
  Box,
  Edit,
  Layers,
  Loader2,
  Lock,
  Maximize2,
  Package2,
  RotateCcw,
  Tag,
  Trash2,
} from "lucide-react";
import { Shelf, ShelfLevelItem } from "@/src/types";
import { Badge } from "@/src/styles/components/ui/badge";
import { toast } from "react-toastify";
import UpdateShelfTypeModal from "./UpdateShelfTypeModal";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

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
  const queryClient = useQueryClient();

  const { data: shelf, isLoading } = useQuery({
    queryKey: ["shelfType", shelfTypeId],
    queryFn: () => getShelfTypeDetailAPI(shelfTypeId!),
    select: (res) => res.data as Shelf,
    enabled: !!shelfTypeId && isOpen,
  });

  async function handleDisable() {
    try {
      await disableShelfTypeAPI(shelfTypeId!);

      queryClient.invalidateQueries({
        queryKey: ["shelfs"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["shelfType", shelfTypeId],
      });

      toast.success("Vô hiệu hóa sản phẩm thành công");
    } catch (error) {
      toast.error(getErrorMessage(error, "Vô hiệu hóa sản phẩm thất bại"));
    }
  }

  async function handleRestore() {
    try {
      await restoreShelfTypeAPI(shelfTypeId!);

      queryClient.invalidateQueries({
        queryKey: ["shelfs"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["shelfType", shelfTypeId],
      });

      toast.success("Khôi phục sản phẩm thành công");
    } catch (error) {
      toast.error(getErrorMessage(error, "Khôi phục sản phẩm thất bại"));
    }
  }

  async function handleDelete() {
    try {
      await deleteShelfTypeAPI(shelfTypeId!);

      queryClient.invalidateQueries({
        queryKey: ["shelfs"],
      });

      onClose();
      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      toast.error(getErrorMessage(error, "Xóa sản phẩm thất bại"));
    }
  }

  if (!shelfTypeId) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <SheetContent className="w-full !max-w-[500px] p-0 flex flex-col gap-0 border-none">
        <SheetHeader className="p-6 border-b bg-white">
          <SheetTitle className="flex items-center gap-2">
            <Box className="text-blue-600" size={24} />
            <span className="text-xl font-bold uppercase tracking-tight">
              Chi tiết loại kệ
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="relative p-6 space-y-8 overflow-y-auto custom-scrollbar h-full">
          {isLoading && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/60 backdrop-blur-[1px] transition-opacity">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                Đang tải dữ liệu...
              </span>
            </div>
          )}
          {/* 1. IMAGE SECTION - Theo style bạn yêu cầu */}
          <div className="relative group">
            <div className="w-full aspect-video rounded-3xl border bg-slate-50 overflow-hidden relative shadow-inner flex items-center justify-center">
              {shelf?.imageUrl ? (
                <Image
                  src={shelf?.imageUrl}
                  alt={shelf.name}
                  fill
                  className="object-contain p-4 animate-in fade-in duration-500"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Package2 size={40} className="opacity-20" />
                  <span className="text-sm">Không có hình ảnh</span>
                </div>
              )}

              {/* Badge thông tin nhanh trên ảnh */}
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md px-2 py-0.5 text-[12px] font-bold uppercase tracking-wider">
                  {shelf?.totalLevels} Tầng
                </Badge>
              </div>
            </div>
          </div>

          {/* 2. BASIC INFO SECTION */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-bold text-blue-500">
                Rộng
              </span>
              <span className="text-lg font-bold text-blue-900">
                {shelf?.width} <small>cm</small>
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-500">
                Cao
              </span>
              <span className="text-lg font-bold text-indigo-900">
                {shelf?.height} <small>cm</small>
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-bold text-violet-500">
                Sâu
              </span>
              <span className="text-lg font-bold text-violet-900">
                {shelf?.depth} <small>cm</small>
              </span>
            </div>
          </div>

          {/* 3. CATEGORIES SECTION */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-700">
              <Tag size={16} /> DANH MỤC SẢN PHẨM GỢI Ý
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(shelf?.suitableProductCategoryTypes) ? (
                shelf?.suitableProductCategoryTypes.map((cat: string) => (
                  <span
                    key={cat}
                    className="bg-slate-100 text-slate-600 border border-slate-200 py-1 px-3 rounded-full text-xs font-medium"
                  >
                    {cat}
                  </span>
                ))
              ) : shelf?.suitableProductCategoryTypes ? (
                (shelf.suitableProductCategoryTypes as unknown as string)
                  .split(",")
                  .map((cat: string) => (
                    <span
                      key={cat.trim()}
                      className="bg-slate-100 text-slate-600 border border-slate-200 py-1 px-3 rounded-full text-xs font-medium"
                    >
                      {cat.trim()}
                    </span>
                  ))
              ) : (
                <span className="text-slate-400 text-xs italic">
                  Chưa có danh mục
                </span>
              )}
            </div>
          </div>

          {/* 4. LEVELS LIST SECTION */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-700">
              <Layers size={16} /> CẤU TRÚC CHI TIẾT CÁC TẦNG
            </h3>

            <div className="space-y-4">
              {shelf?.levels?.map((item: ShelfLevelItem, index: number) => (
                <div
                  key={index}
                  className="relative p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <div className="absolute top-5 left-0 w-1 h-10 bg-blue-500 rounded-r-full"></div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">{item.name}</h4>

                    <div className="text-right">
                      <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        Sức chứa: {item.recommendedCapacity} SP
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50 w-fit">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-600 rounded text-[10px] font-bold text-white uppercase tracking-tight">
                      Tầng {item.level}
                    </div>

                    <div className="w-[1px] h-3 bg-slate-200"></div>

                    <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                      <Maximize2 size={12} className="text-blue-500/70" />
                      <span className="text-slate-600">Chiều cao:</span>
                      <b className="text-slate-900">
                        {item.clearanceHeight} cm
                      </b>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-600 uppercase">
                      Danh mục sản phẩm gợi ý trưng bày:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(item?.suitableProductCategoryTypes) ? (
                        item?.suitableProductCategoryTypes.map(
                          (cat: string) => (
                            <span
                              key={cat}
                              className="bg-slate-100 text-slate-600 border border-slate-200 py-1 px-3 rounded-full text-xs font-medium"
                            >
                              {cat}
                            </span>
                          ),
                        )
                      ) : item?.suitableProductCategoryTypes ? (
                        (item.suitableProductCategoryTypes as unknown as string)
                          .split(",")
                          .map((cat: string) => (
                            <span
                              key={cat.trim()}
                              className="bg-slate-100 text-slate-600 border border-slate-200 py-1 px-3 rounded-full text-xs font-medium"
                            >
                              {cat.trim()}
                            </span>
                          ))
                      ) : (
                        <span className="text-slate-400 text-xs italic">
                          Chưa có danh mục
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        {!isLoading && (
          <div className="p-4 border-t bg-white flex items-center gap-3 shadow-[0_-8px_20px_rgba(0,0,0,0.04)]">
            <div className="flex gap-2 flex-1">
              {shelf?.isActive ? (
                <button
                  onClick={handleDisable}
                  title="Vô hiệu hóa sản phẩm"
                  className="flex items-center justify-center w-full h-11 gap-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all"
                >
                  <Lock size={18} /> Vô hiệu hóa
                </button>
              ) : (
                <>
                  <button
                    onClick={handleDelete}
                    title="Xóa vĩnh viễn"
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all font-medium text-sm"
                  >
                    <Trash2 size={18} />
                    Xóa
                  </button>

                  <button
                    onClick={handleRestore}
                    title="Khôi phục hoạt động"
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all font-medium text-sm"
                  >
                    <RotateCcw size={18} />
                    Mở lại
                  </button>
                </>
              )}
            </div>

            <UpdateShelfTypeModal shelfTypeId={shelfTypeId} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default ViewDetailSheet;
