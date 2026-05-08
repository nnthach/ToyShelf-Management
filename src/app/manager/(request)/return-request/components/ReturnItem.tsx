"use client";

import { useWatch, UseFormReturn } from "react-hook-form";
import {
  Hash,
  ImagePlus,
  Layers,
  Package,
  Server,
  Trash2,
  X,
} from "lucide-react";
import { ReturnFormValues } from "@/src/schemas/return.schema";
import { SelectOption } from "@/src/types/SubType";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { getAllProductColorColorAPI } from "@/src/services/product.service";
import { ProductColorItem } from "@/src/types";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ReturnItemProps {
  index: number;
  form: UseFormReturn<ReturnFormValues>;
  remove: (index: number) => void;
  fieldsLength: number;
  shelfOptions: SelectOption[];
}

function ReturnItem({
  index,
  form,
  remove,
  fieldsLength,
  shelfOptions,
}: ReturnItemProps) {
  const [searchProduct, setSearchProduct] = useState("");
  const debounceSearch = useDebounce(searchProduct, 500);
  const [openDropdown, setOpenDropdown] = useState(false);
  const { watch, setValue } = form;

  // product color
  const { data: productColorIdList = [] } = useQuery({
    queryKey: ["productColors", debounceSearch],
    queryFn: () => getAllProductColorColorAPI({ keyword: debounceSearch }),
    select: (res) => res.data as ProductColorItem[],
    enabled: !!debounceSearch,
  });

  const type = useWatch({
    control: form.control,
    name: `items.${index}.type`,
  });

  const imageFiles =
    useWatch({
      control: form.control,
      name: `items.${index}.imageFile`,
    }) || [];

  const previewList = imageFiles.map((file: File) => URL.createObjectURL(file));

  const typeOptions = [
    {
      value: "Shelf",
      label: "Kệ",
    },
    {
      value: "Product",
      label: "Đồ chơi",
    },
  ];

  const typeValue = watch(`items.${index}.type`);

  useEffect(() => {
    if (typeValue === "Shelf") {
      setValue(`items.${index}.quantity`, 1);
    }
  }, [typeValue]);

  return (
    <div className="group relative bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-blue-200 transition-all">
      {/* Nút xóa nổi lên khi hover */}
      {fieldsLength > 1 && (
        <button
          type="button"
          onClick={() => remove(index)}
          className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-red-100 text-red-500 rounded-full flex items-center justify-center shadow-sm hover:bg-red-500 hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* KHỐI ẢNH (Bên trái) - Chiếm 2/4 cột */}
        <div className="col-span-1 md:col-span-2 space-y-3">
          <label className="text-[12px] font-bold uppercase tracking-wider flex justify-between">
            Hình ảnh sản phẩm
            <span className="text-slate-400 font-normal">
              {imageFiles.length}/2
            </span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            {/* LIST ẢNH */}
            {previewList.map((url, i) => (
              <div key={i} className="relative w-full aspect-square">
                <img
                  src={url}
                  alt="preview"
                  className="w-full h-full object-cover rounded-md"
                />

                {/* nút xoá */}
                <button
                  type="button"
                  onClick={() => {
                    const newFiles = imageFiles.filter((_, idx) => idx !== i);
                    form.setValue(`items.${index}.imageFile`, newFiles);
                  }}
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}

            {/* NÚT ADD */}
            {imageFiles.length < 2 && (
              <label
                htmlFor={`image-${index}`}
                className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 text-slate-400 transition-all"
              >
                <ImagePlus size={24} />
                <span className="text-[10px] mt-1 font-medium">Thêm ảnh</span>
              </label>
            )}
          </div>

          <input
            id={`image-${index}`}
            type="file"
            multiple
            accept="image/*"
            hidden
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              form.setValue(`items.${index}.imageFile`, [
                ...imageFiles,
                ...files,
              ]);
            }}
          />
        </div>

        {/* KHỐI FORM (Bên phải) */}
        <div className="col-span-2 grid grid-cols-2 gap-x-4 gap-y-3">
          {/* Hàng 1: Loại và Số lượng */}
          <FormFieldCustom
            name={`items.${index}.type`}
            label="Loại hàng"
            type="select"
            selectData={typeOptions}
            icon={<Layers size={16} />}
            required
          />
          <FormFieldCustom
            name={`items.${index}.quantity`}
            label="Số lượng"
            type="number"
            placeholder="0"
            icon={<Hash size={16} />}
            required
            disabled={typeValue === "Shelf"}
          />

          {/* Hàng 2: Sản phẩm (Chiếm full ngang nếu cần hoặc chia đôi) */}
          <div className="sm:col-span-2">
            {type === "Product" && (
              <div className="sm:col-span-1 relative">
                <div className="flex items-center gap-1 text-[14px] mb-1 font-semibold text-slate-700">
                  <Package size={16} className="text-primary/80" />

                  <label>
                    Mã sản phẩm <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 h-9 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
                  {/*Search */}
                  <input
                    className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400"
                    placeholder="Nhập mã sản phẩm..."
                    value={searchProduct}
                    onChange={(e) => {
                      setSearchProduct(e.target.value);
                      setOpenDropdown(true);
                      form.setValue(`items.${index}.productColorId`, undefined);
                    }}
                    onFocus={() => setOpenDropdown(true)}
                    onBlur={() => setTimeout(() => setOpenDropdown(false), 150)}
                  />
                  {searchProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchProduct("");
                        form.setValue(
                          `items.${index}.productColorId`,
                          undefined,
                        );
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
                  <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-md max-h-[200px] custom-scrollbar overflow-y-auto">
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
                            form.setValue(
                              `items.${index}.productColorId`,
                              p.productColorId,
                            );
                            setSearchProduct(p.variantSku);
                            setOpenDropdown(false);
                          }}
                        >
                          <div className="relative w-10 h-10 overflow-hidden rounded border border-slate-100 flex-shrink-0">
                            <Image
                              src={p?.imageUrl || "/placeholder-product.png"}
                              alt={p?.variantSku}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium">{p.variantSku}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/*shelf */}
            {type === "Shelf" && (
              <FormFieldCustom
                name={`items.${index}.shelfId`}
                label="Kệ"
                placeholder="Chọn kệ"
                type="select"
                selectData={shelfOptions}
                icon={<Server size={16} />}
                required
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnItem;
