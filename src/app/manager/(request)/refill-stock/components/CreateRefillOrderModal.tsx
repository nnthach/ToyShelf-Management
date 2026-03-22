import useQueryParams from "@/src/hooks/useQueryParams";
import {
  RefillOrderFormValues,
  refillOrderSchema,
} from "@/src/schemas/refill-order.schema";
import { getAllProductAPI } from "@/src/services/product.service";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/src/styles/components/ui/dialog";
import { Product, ProductColorItem } from "@/src/types";
import { QueryParams } from "@/src/types/SubType";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose, DialogContent } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { Plus, Send, Sparkles, Trash2 } from "lucide-react";
import { memo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

function CreateRefillOrderModal() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const {
    data: productList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products", searchTerm],
    queryFn: () => getAllProductAPI({ ...query, searchItem: searchTerm }),
    enabled: searchTerm.length > 1,
    select: (res) => res.data.items,
  });

  const onSubmit = (data: RefillOrderFormValues) => {
    // Chỉ gửi productColorId và quantity lên server
    const payload = {
      items: data.items.map((item) => ({
        productColorId: item.productColorId,
        quantity: item.quantity,
      })),
    };
    console.log("Payload gửi server:", payload);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="btn-primary-gradient">
          <Plus /> Tạo yêu cầu
        </Button>
      </DialogTrigger>
<DialogContent className="sm:max-w-[600px] flex flex-col h-[80vh]">
        <DialogHeader className="p-6 border-b">
           <DialogTitle>Tạo yêu cầu bổ sung hàng</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* PHẦN 1: TÌM KIẾM VÀ CHỌN SẢN PHẨM */}
          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-slate-700">Tìm sản phẩm & màu sắc</label>
            <div className="relative">
              <input
                className="w-full p-2 border rounded-md"
                placeholder="Nhập tên sản phẩm để tìm..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              {/* Dropdown kết quả */}
              {searchTerm && (
                <div className="absolute top-full left-0 w-full bg-white border shadow-xl rounded-md mt-1 z-50 max-h-[300px] overflow-y-auto">
                  {productList.map((product: Product) => (
                    <div key={product.id} className="p-2 border-b last:border-none">
                      <p className="text-[10px] font-bold text-primary uppercase">{product.name}</p>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        {product.colors.map((color: ProductColorItem) => (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => {
                              append({
                                productColorId: color.id,
                                quantity: 1,
                                name: product.name,
                                colorName: color.colorName
                              });
                              setSearchTerm(""); // Reset search sau khi chọn
                            }}
                            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded text-left text-xs transition-colors"
                          >
                            <div 
                                className="w-3 h-3 rounded-full border shadow-sm" 
                                style={{ backgroundColor: color.hexcode }}
                            />
                            <span className="truncate">{color.colorName}</span>
                            <Plus size={12} className="ml-auto text-slate-400" />
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
              <div key={field.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate uppercase">{field.name}</p>
                  <p className="text-[10px] text-muted-foreground italic">Màu: {field.colorName}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    {...form.register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                    className="w-20 p-1 border rounded text-center font-bold text-sm"
                    min={1}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => remove(index)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="p-4 border-t bg-slate-50/50">
          <Button onClick={form.handleSubmit(onSubmit)} variant="success" className="w-full font-bold">
            <Send className="mr-2 h-4 w-4" /> Xác nhận yêu cầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CreateRefillOrderModal);
