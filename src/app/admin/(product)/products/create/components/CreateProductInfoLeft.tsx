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

function CreateProductInfoLeft() {
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
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <FormFieldCustom
            name="name"
            label="Tên sản phẩm"
            placeholder="Tên sản phẩm"
          />
          <FormFieldCustom
            name="productCategoryId"
            label="Danh mục"
            placeholder="Chọn danh mục"
            type="select"
            selectData={categoryOptions}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormFieldCustom
            name="price"
            label="Giá"
            placeholder="Giá"
            type="number"
          />
          <FormFieldCustom
            name="size"
            label="Kích thước"
            placeholder="Chọn kích thước"
            type="select"
            selectData={categoryOptions}
          />
          <FormFieldCustom
            name="weight"
            label="Cân nặng"
            placeholder="Chọn cân nặng"
            labelNote="(gram)"
            type="number"
          />
          <FormFieldCustom
            name="material"
            label="Chất liệu"
            placeholder="Chọn chất liệu"
            type="select"
            selectData={ProductMaterialOption}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <FormFieldCustom
            name="brand"
            label="Thương hiệu"
            placeholder="Chọn thương hiệu"
            type="select"
            selectData={ProductBrandOption}
          />
          <FormFieldCustom
            name="originCountry"
            label="Quốc gia sản xuất"
            placeholder="Quốc gia sản xuất"
          />
          <FormFieldCustom
            name="ageRange"
            label="Độ tuổi"
            placeholder="Độ tuổi"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <FormFieldCustom
            name="length"
            label="Chiều dài"
            placeholder="Chiều dài"
            labelNote="(cm)"
            type="number"
          />
          <FormFieldCustom
            name="width"
            label="Chiều rộng"
            placeholder="Chiều rộng"
            labelNote="(cm)"
            type="number"
          />
          <FormFieldCustom
            name="height"
            label="Chiều cao"
            labelNote="(cm)"
            placeholder="Chiều cao"
            type="number"
          />
        </div>
        <FormFieldCustom
          name="description"
          label="Mô tả"
          placeholder="Mô tả"
          type="textarea"
        />
      </div>
    </div>
  );
}

export default memo(CreateProductInfoLeft);
