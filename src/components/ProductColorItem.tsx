import { useWatch, UseFormReturn } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { SelectOption } from "../types/SubType";
import {
  ProductFormValues,
  ProductUpdateFormValues,
} from "../schemas/product.schema";
import ModelThreeDPreview from "../styles/components/custom/ModelThreeDPreview";
import { FormFieldCustom } from "../styles/components/custom/FormFieldCustom";

interface ProductColorItemProps {
  index: number;
  form: UseFormReturn<ProductUpdateFormValues | ProductFormValues>;
  remove: (index: number) => void;
  fieldsLength: number;
  colorOptions: SelectOption[];
  priceSegmentOptions: SelectOption[];
}

function ProductColorItem({
  index,
  form,
  remove,
  fieldsLength,
  colorOptions,
  priceSegmentOptions,
}: ProductColorItemProps) {
  const imageUrl = useWatch({
    control: form.control,
    name: `colors.${index}.imageUrl`,
  });

  const model3DUrl = useWatch({
    control: form.control,
    name: `colors.${index}.model3DUrl`,
  });

  return (
    <div className="relative border p-3 rounded-md items-center">
      {fieldsLength > 1 && (
        <button
          type="button"
          onClick={() => remove(index)}
          className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-500 rounded-md flex items-center justify-center transition"
        >
          <Trash2 size={16} className="text-red-500 hover:text-white" />
        </button>
      )}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <FormFieldCustom
                name={`colors.${index}.colorId`}
                label="Màu sắc"
                placeholder="Chọn màu sắc"
                type="select"
                selectData={colorOptions}
              />
              <FormFieldCustom
                name={`colors.${index}.price`}
                label="Giá sản phẩm"
                placeholder="Giá sản phẩm"
                type="number"
              />

              <FormFieldCustom
                name={`colors.${index}.priceSegmentId`}
                label="Phân khúc giá"
                placeholder="Chọn phân khúc giá"
                type="select"
                selectData={priceSegmentOptions}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-3">
            {/* ================= 3D UPLOAD ================= */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">File mô hình 3D</span>

              <input
                id={`model3d-${index}`}
                type="file"
                accept=".glb,.gltf"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const previewUrl = URL.createObjectURL(file);

                  form.setValue(`colors.${index}.model3DFile`, file);
                  form.setValue(`colors.${index}.model3DUrl`, previewUrl, {
                    shouldValidate: true,
                  });
                }}
              />

              <label
                htmlFor={`model3d-${index}`}
                className="relative w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl
                flex items-center justify-center hover:border-blue-500 transition cursor-pointer bg-muted"
              >
                {model3DUrl ? (
                  <div className="h-full w-full rounded-xl overflow-hidden">
                    <ModelThreeDPreview
                      key={model3DUrl}
                      url={model3DUrl || ""}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        form.setValue(`colors.${index}.model3DUrl`, "");
                        form.setValue(`colors.${index}.model3DFile`, undefined);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-md flex items-center justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <span className="text-sm">Thêm file 3D</span>
                    <span className="text-xs text-gray-400 mt-1">
                      (.glb, .gltf)
                    </span>
                  </div>
                )}
              </label>
            </div>

            {/* ================= IMAGE UPLOAD ================= */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Hình ảnh sản phẩm</span>

              <input
                id={`image-${index}`}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const previewUrl = URL.createObjectURL(file);

                  form.setValue(`colors.${index}.imageFile`, file);
                  form.setValue(`colors.${index}.imageUrl`, previewUrl, {
                    shouldValidate: true,
                  });
                }}
              />

              <label
                htmlFor={`image-${index}`}
                className="relative w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl
                flex items-center justify-center hover:border-blue-500 transition cursor-pointer bg-muted overflow-hidden"
              >
                {imageUrl ? (
                  <div>
                    <img
                      src={imageUrl || ""}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        form.setValue(`colors.${index}.imageUrl`, "");
                        form.setValue(`colors.${index}.imageFile`, undefined);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-md flex items-center justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">Thêm hình ảnh</span>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductColorItem;
