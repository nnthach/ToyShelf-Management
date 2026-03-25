import { useDebounce } from "@/src/hooks/useDebounce";
import useQueryParams from "@/src/hooks/useQueryParams";
import {
  RefillOrderFormValues,
  refillOrderSchema,
} from "@/src/schemas/refill-order.schema";
import { getAllProductAPI } from "@/src/services/product.service";
import { createRefillAPI } from "@/src/services/refill.service";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogDescription,
} from "@/src/styles/components/ui/dialog";
import { Product, ProductColorItem } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import { formatColorNameToVN } from "@/src/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Send, Sparkles, Store, Trash2 } from "lucide-react";
import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

function CreateRefillOrderModal() {
  const queryClient = useQueryClient();

  const searchRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    searchItem: "",
    pageNumber: 1,
    pageSize: 10,
  });

  const form = useForm<RefillOrderFormValues>({
    resolver: zodResolver(refillOrderSchema),
    defaultValues: { items: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const { data: productList = [], isLoading } = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () => getAllProductAPI({ ...query, searchItem: debouncedSearch }),
    enabled: debouncedSearch.trim().length > 1,
    select: (res) => res.data.items,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = async (data: RefillOrderFormValues) => {
    const payload = {
      items: data.items.map((item) => ({
        productColorId: item.productColorId,
        quantity: item.quantity,
      })),
    };

    try {
      await createRefillAPI(payload);

      queryClient.invalidateQueries({
        queryKey: ["refillRequests"],
      });
      
      toast.success("Tạo yêu cầu thành công");
      form.reset();
      setSearchTerm("");
      setOpen(false);
    } catch (error) {
      toast.error("Tạo yêu cầu thất bại");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          form.reset();
          setSearchTerm("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="btn-primary-gradient">
          <Plus /> Tạo yêu cầu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] flex flex-col h-[80vh]">
        <DialogHeader className="p-6 py-2 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Store className="text-primary" size={24} />
            Tạo yêu cầu bổ sung hàng
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-amber-500" />
            Tìm kiểm thông tin sản phẩm.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* PHẦN 1: TÌM KIẾM VÀ CHỌN SẢN PHẨM */}
          <div className="space-y-2 relative" ref={searchRef}>
            <label className="text-sm font-bold text-slate-700">
              Tìm sản phẩm
            </label>
            <div className="relative">
              <input
                className="w-full p-2 border rounded-md"
                placeholder="Nhập tên sản phẩm để tìm..."
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={(e) => setSearchTerm(e.target.value)}
              />

              {/* Dropdown kết quả */}
              {searchTerm.trim().length > 1 && (
                <div className="absolute top-full left-0 w-full bg-white border shadow-xl rounded-md mt-1 z-50 max-h-[250px] overflow-y-auto custom-scrollbar">
                  {isLoading && (
                    <p className="p-3 text-sm text-muted-foreground italic text-center">
                      Đang tìm kiếm...
                    </p>
                  )}

                  {!isLoading && productList.length === 0 && (
                    <p className="p-3 text-sm text-muted-foreground text-center">
                      Không có kết quả
                    </p>
                  )}

                  {!isLoading &&
                    productList.map((product: Product) => (
                      <div
                        key={product.id}
                        className="border-b last:border-none"
                      >
                        {/* Header: Tên SP + Danh mục + Thương hiệu */}
                        <div className="bg-slate-50/80 px-3 py-2 border-b">
                          <p className="text-[11px] font-bold text-primary uppercase leading-tight">
                            {product.name}
                          </p>
                          <div className="flex gap-2 mt-0.5">
                            <span className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded">
                              {product.productCategoryName}
                            </span>
                            <span className="text-[9px] bg-amber-100 text-amber-700 px-1 rounded">
                              {product.brand}
                            </span>
                          </div>
                        </div>

                        {/* Danh sách biến thể màu sắc */}
                        <div className="flex flex-col">
                          {product.colors.map((color: ProductColorItem) => (
                            <button
                              key={color.id}
                              type="button"
                              onClick={() => {
                                append({
                                  productColorId: color.id,
                                  quantity: 1,
                                  name: product.name,
                                  colorName: color.colorName,
                                  hexcode: color.hexcode,
                                  sku: color.sku,
                                  imageUrl: color.imageUrl,
                                });
                                setSearchTerm("");
                              }}
                              className="flex items-center gap-3 p-2 hover:bg-slate-100 transition-colors text-left"
                            >
                              {/* Thumbnail kèm chấm màu */}
                              <div className="relative w-10 h-10 flex-shrink-0">
                                <Image
                                  src={color.imageUrl}
                                  alt={color.colorName || "Product image"}
                                  fill
                                  sizes="40px"
                                  className="object-cover rounded border bg-white"
                                />
                                <div
                                  className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
                                  style={{ backgroundColor: color.hexcode }}
                                />
                              </div>

                              {/* SKU và Tên Màu */}
                              <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-mono font-bold text-slate-600">
                                  {color.sku}
                                </span>
                                <span className="text-xs text-slate-500 truncate">
                                  Màu:{" "}
                                  {formatColorNameToVN(
                                    color?.colorName as string,
                                  )}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* PHẦN 2: DANH SÁCH ĐÃ CHỌN (FieldArray) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-2">
              Danh sách đã chọn ({fields.length})
            </h4>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200 shadow-sm"
              >
                {/* Thumbnail sản phẩm đã chọn */}
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={(field.imageUrl as string) || "/placeholder.png"}
                    alt={field.name || "Product image"}
                    fill
                    sizes="48px"
                    className="object-cover rounded border bg-white"
                  />
                  <div
                    className="absolute -top-1 -right-2 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: field.hexcode as string }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold truncate uppercase leading-tight text-slate-700">
                    {field.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[10px] text-muted-foreground font-mono bg-slate-100 px-1 rounded">
                      {field.sku as string}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      • {formatColorNameToVN(field.colorName as string)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    {...form.register(`items.${index}.quantity` as const, {
                      valueAsNumber: true,
                    })}
                    className="w-14 p-1 border rounded text-center font-bold text-xs"
                    min={1}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => remove(index)}
                    className="h-8 w-8 text-destructive hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="p-4 border-t bg-slate-50/50">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            variant="success"
            className="w-full font-bold"
          >
            <Send className="mr-2 h-4 w-4" /> Xác nhận yêu cầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CreateRefillOrderModal);
