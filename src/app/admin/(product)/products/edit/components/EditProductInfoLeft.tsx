"use client";

import {
  ProductBrandOption,
  ProductMaterialOption,
} from "@/src/constants/product-option";
import { getAllProductCategoryAPI } from "@/src/services/product-category.service";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { ProductCategory } from "@/src/types";
import { SelectOption } from "@/src/types/SubType";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import {
  Package,
  Tags,
  DollarSign,
  Weight,
  Box,
  Flag,
  Baby,
  ArrowsUpFromLine,
  ArrowRightLeft,
  ArrowUpToLine,
  FileText,
} from "lucide-react";

function EditProductInfoLeft() {
  // product category
  const { data: categoryList = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllProductCategoryAPI({}),
    select: (res) => res.data as ProductCategory[],
  });

  const categoryOptions: SelectOption[] = categoryList.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  return (
    <div className="bg-background rounded-lg p-4 border h-full overflow-y-auto">
      <div className="mb-4">
        <h1 className="text-md font-bold text-gray-950 dark:text-foreground">
          Thông tin sản phẩm
        </h1>
        <p className="text-gray-500 text-sm">
          Vui lòng điền đầy đủ thông tin sản phẩm
        </p>
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormFieldCustom
            name="name"
            label="Tên sản phẩm"
            placeholder="Ví dụ: Giày Sneaker Nam A1"
            icon={<Package size={18} />} // Icon Tên sản phẩm
          />
          <FormFieldCustom
            name="productCategoryId"
            label="Danh mục"
            placeholder="Chọn danh mục"
            type="select"
            selectData={categoryOptions}
            icon={<Tags size={18} />} // Icon Danh mục
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormFieldCustom
            name="price"
            label="Giá bán"
            placeholder="0"
            type="number"
            icon={<DollarSign size={18} />} // Icon Giá
          />
          <FormFieldCustom
            name="weight"
            label="Cân nặng"
            placeholder="0"
            labelNote="(gram)"
            type="number"
            icon={<Weight size={18} />} // Icon Cân nặng
          />
          <FormFieldCustom
            name="material"
            label="Chất liệu"
            placeholder="Chọn chất liệu"
            type="select"
            selectData={ProductMaterialOption}
            icon={<Box size={18} />} // Icon Chất liệu
          />
          <FormFieldCustom
            name="brand"
            label="Thương hiệu"
            placeholder="Chọn thương hiệu"
            type="select"
            selectData={ProductBrandOption}
            icon={<Tags size={18} />} // Icon Thương hiệu (dùng chung với Tag)
          />
          <FormFieldCustom
            name="originCountry"
            label="Quốc gia"
            placeholder="Ví dụ: Việt Nam"
            icon={<Flag size={18} />} // Icon Quốc gia
          />
          <FormFieldCustom
            name="ageRange"
            label="Độ tuổi"
            placeholder="Ví dụ: 5-10"
            icon={<Baby size={18} />} // Icon Độ tuổi
          />
        </div>

        {/* Khối kích thước chi tiết */}
        <div className="grid grid-cols-3 gap-4">
          <FormFieldCustom
            name="length"
            label="Chiều dài"
            placeholder="0"
            labelNote="(cm)"
            type="number"
            icon={<ArrowRightLeft size={18} />} // Icon Chiều dài (ngang)
          />
          <FormFieldCustom
            name="width"
            label="Chiều rộng"
            placeholder="0"
            labelNote="(cm)"
            type="number"
            icon={<ArrowsUpFromLine size={18} />} // Icon Chiều rộng (sâu)
          />
          <FormFieldCustom
            name="height"
            label="Chiều cao"
            placeholder="0"
            labelNote="(cm)"
            type="number"
            icon={<ArrowUpToLine size={18} />} // Icon Chiều cao (đứng)
          />
        </div>

        <FormFieldCustom
          name="description"
          label="Mô tả sản phẩm"
          placeholder="Nhập mô tả chi tiết về sản phẩm, đặc điểm nổi bật..."
          type="textarea"
          className="min-h-[120px]"
          icon={<FileText size={18} />} // Icon Mô tả
        />
      </div>
    </div>
  );
}

export default memo(EditProductInfoLeft);
