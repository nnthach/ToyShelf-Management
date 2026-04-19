"use client";

import { useDebounce } from "@/src/hooks/useDebounce";
import { getAllInventoryLocationAPI } from "@/src/services/inventory-location.service";
import { refillInventoryAPI } from "@/src/services/inventory.service";
import { getAllProductColorColorAPI } from "@/src/services/product.service";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/styles/components/ui/dialog";
import { InventoryLocation, ProductColorItem } from "@/src/types";
import { SelectOption } from "@/src/types/SubType";
import { getErrorMessage } from "@/src/utils/getErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Mail,
  MapPin,
  Package,
  Plus,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

function CreateInventoryModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [searchProduct, setSearchProduct] = useState("");
  const debounceSearch = useDebounce(searchProduct, 500);
  const [openDropdown, setOpenDropdown] = useState(false);

  const formSchema = z.object({
    inventoryLocationId: z.string().min(1, "Vị trí kho hàng bắt buộc nhập"),
    productColorId: z.string().min(1, "Sản phẩm bắt buộc phải nhập"),
    quantity: z.coerce.number().min(1, "Phải nhập số lượng"),
  });

  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inventoryLocationId: "",
      productColorId: "",
      quantity: 0,
    },
  });

  async function onSubmit(data: z.input<typeof formSchema>) {
    try {
      await refillInventoryAPI(data);
      queryClient.invalidateQueries({
        queryKey: ["inventories"],
      });
      form.reset();
      toast.success("Nhập hàng thành công");
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Nhập hàng thất bại"));
    }
  }

  const { data: productColorIdList = [] } = useQuery({
    queryKey: ["productColors", debounceSearch],
    queryFn: () => getAllProductColorColorAPI({ keyword: debounceSearch }),
    select: (res) => res.data as ProductColorItem[],
    enabled: !!debounceSearch,
  });

  const { data: inventoryLocationList = [] } = useQuery({
    queryKey: ["inventoryLocations"],
    queryFn: () => getAllInventoryLocationAPI({ locationType: "Warehouse" }),
    select: (res) => res.data as InventoryLocation[],
    enabled: !!open,
  });

  const inventoryLocationOption: SelectOption[] = inventoryLocationList.map(
    (c) => ({
      value: c.id,
      label: c.name,
    }),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setSearchProduct("");
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="btn-primary-gradient">
          <Plus /> Bổ sung hàng hóa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header: Chuyên nghiệp với icon Sparkles */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Bổ sung hàng hóa
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-violet-500" />
            Cập nhật số lượng hàng chính xác.
          </DialogDescription>
        </DialogHeader>

        {/* Form Body: Khoảng cách thoáng (space-y-5) */}
        <div className="p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log("Form errors:", errors);
                console.log("Current values:", form.getValues());
              })}
              className="space-y-5"
              id="form-create-inventory"
            >
              {/*input search product color id */}
              <div className="sm:col-span-1 relative">
                <div className="flex items-center gap-1 text-[14px] mb-1 font-semibold text-slate-700">
                  <Package size={18} className="text-primary/80" />

                  <label>
                    Mã sản phẩm <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 h-9 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
                  <input
                    className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400"
                    placeholder="Nhập mã sản phẩm..."
                    value={searchProduct}
                    onChange={(e) => {
                      setSearchProduct(e.target.value);
                      setOpenDropdown(true);
                      form.setValue(`productColorId`, "");
                    }}
                    onFocus={() => setOpenDropdown(true)}
                    onBlur={() => setTimeout(() => setOpenDropdown(false), 150)}
                  />
                  {searchProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchProduct("");
                        form.setValue(`productColorId`, "");
                      }}
                    >
                      <X
                        size={14}
                        className="text-slate-400 hover:text-slate-600"
                      />
                    </button>
                  )}
                </div>
                {openDropdown && (
                  <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-md overflow-y-auto">
                    {productColorIdList.length === 0 ? (
                      <p className="text-xs text-slate-400 px-3 py-2">
                        Không tìm thấy
                      </p>
                    ) : (
                      productColorIdList.map((p) => (
                        <div
                          key={p.variantSku}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                          onMouseDown={() => {
                            form.setValue(`productColorId`, p.productColorId);
                            setSearchProduct(p.variantSku);
                            setOpenDropdown(false);
                          }}
                        >
                          <span className="font-medium">{p.variantSku}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              {/*end input search */}

              <FormFieldCustom
                name="quantity"
                label="Số lượng"
                icon={<Mail size={18} />}
                type="number"
                required
              />
              <FormFieldCustom
                name="inventoryLocationId"
                label="Vị trí kho"
                placeholder="Chọn vị trí kho"
                type="select"
                selectData={inventoryLocationOption}
                icon={<MapPin size={18} />}
                required
              />
            </form>
          </FormProvider>
        </div>

        {/* Footer: Nút bấm đồng bộ với các modal trước */}
        <DialogFooter className="p-4 bg-slate-50/50 border-t flex gap-3">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="flex-1 font-medium text-slate-600 hover:bg-slate-200"
            >
              Hủy bỏ
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={() => console.log("alo", form)}
            form="form-create-inventory"
            className="flex-1 min-w-[140px] gap-2 font-bold shadow-md active:scale-95 transition-all"
            variant="success"
          >
            <Send className="h-4 w-4" />
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateInventoryModal;
