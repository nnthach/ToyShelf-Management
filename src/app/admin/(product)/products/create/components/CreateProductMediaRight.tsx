import ProductColorItem from "@/src/components/ProductColorItem";
import { ProductFormValues } from "@/src/schemas/product.schema";
import { Button } from "@/src/styles/components/ui/button";
import { SelectOption } from "@/src/types/SubType";
import { memo } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

interface CreateProductMediaRightProps {
  form: UseFormReturn<ProductFormValues>;
  colorOptions: SelectOption[];
  priceSegmentOptions: SelectOption[];
}

function CreateProductMediaRight({
  form,
  colorOptions,
  priceSegmentOptions,
}: CreateProductMediaRightProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "colors",
  });

  return (
    <div className="bg-background rounded-lg p-4 border h-full overflow-y-auto">
      <div className="mb-4">
        <h1 className="text-md font-bold text-gray-950 dark:text-foreground">
          Màu sắc, hình ảnh và mô hình 3D
        </h1>
        <p className="text-gray-500 text-sm">
          Lựa chọn màu sắc, tải lên hình ảnh sản phẩm và file mô hình 3D
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <ProductColorItem
            key={field.id}
            index={index}
            form={form}
            remove={remove}
            fieldsLength={fields.length}
            colorOptions={colorOptions}
            priceSegmentOptions={priceSegmentOptions}
          />
        ))}

        <Button
          type="button"
          onClick={() =>
            append({
              name: "",
              colorId: "",
              priceSegmentId: "",
              price: 0,
              model3DUrl: "",
              imageUrl: "",
            })
          }
        >
          Thêm màu
        </Button>
      </div>
    </div>
  );
}

export default memo(CreateProductMediaRight);
