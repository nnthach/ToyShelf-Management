import { memo, useEffect, useRef, useState } from "react";
import {
  useForm,
  useFieldArray,
  FormProvider,
  Controller,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Trash2,
  ClipboardList,
  Send,
  Layers,
  Maximize,
  Check,
  HelpCircle,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/src/styles/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/styles/components/ui/dialog";
import { Button } from "@/src/styles/components/ui/button";
import { ProductCategory } from "@/src/types";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { createShelfTypeAPI } from "@/src/services/shelf.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProductCategoryAPI } from "@/src/services/product-category.service";
import { toast } from "react-toastify";
import { uploadFileToCloudinary } from "@/src/config/cloundinary";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(1, "Tên loại kệ là bắt buộc"),
  imageUrl: z.string().min(1, "Link ảnh là bắt buộc"),
  width: z.coerce.number().min(1, "Chiều rộng > 0"),
  height: z.coerce.number().min(1, "Chiều cao > 0"),
  depth: z.coerce.number().min(1, "Chiều sâu > 0"),
  totalLevels: z.coerce
    .number()
    .min(1, "Tối thiểu 1 tầng")
    .max(20, "Tối đa 20 tầng"),
  suitableProductCategoryTypes: z
    .array(z.string())
    .min(1, "Chọn ít nhất 1 loại danh mục chung"),
  displayGuideline: z.string().optional(),
  levels: z.array(
    z.object({
      level: z.number(),
      name: z.string().min(1, "Tên tầng là bắt buộc"),
      clearanceHeight: z.coerce.number().min(1, "Chiều cao thông thủy > 0"),
      recommendedCapacity: z.coerce.number().min(1, "Sức chứa > 0"),
      suitableProductCategoryTypes: z
        .array(z.string())
        .min(1, "Chọn ít nhất 1 loại danh mục"),
      displayGuideline: z.string().optional(),
    }),
  ),
});

type FormValues = z.input<typeof formSchema>;

function CreateShelfTypeModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: categoryList = [] } = useQuery({
    queryKey: ["productCategories"],
    queryFn: () => getAllProductCategoryAPI({ isActive: true }),
    select: (res) => res.data,
  });

  /*IMAGE */
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warn("Vui lòng chọn hình ảnh");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };
  /*END IMAGE */

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      width: 0,
      height: 0,
      depth: 0,
      totalLevels: 1,
      suitableProductCategoryTypes: [],
      displayGuideline: "",
      levels: [
        {
          level: 1,
          name: "Tầng 1",
          clearanceHeight: 0,
          recommendedCapacity: 0,
          suitableProductCategoryTypes: [],
        },
      ],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "levels",
  });

  // Tự động cập nhật số lượng tầng khi totalLevels thay đổi
  const watchTotalLevels = form.watch("totalLevels");
  useEffect(() => {
    const currentLevels = form.getValues("levels");
    const targetCount = Number(watchTotalLevels) || 0;

    if (targetCount > 0 && targetCount !== currentLevels.length) {
      const newLevels = Array.from({ length: targetCount }, (_, i) => ({
        level: i + 1,
        name: currentLevels[i]?.name || `Tầng ${i + 1}`,
        clearanceHeight: currentLevels[i]?.clearanceHeight || 0,
        recommendedCapacity: currentLevels[i]?.recommendedCapacity || 0,
        suitableProductCategoryTypes:
          currentLevels[i]?.suitableProductCategoryTypes || [],
        displayGuideline: currentLevels[i]?.displayGuideline || "",
      }));
      replace(newLevels);
    }
  }, [watchTotalLevels, replace, form]);

  // submit form
  async function onSubmit(data: FormValues) {
    console.log("Form data to submit:", data);
    setIsLoading(true);

    try {
      const imageUrl = imageFile
        ? await uploadFileToCloudinary(imageFile, "shelf")
        : null;

      await createShelfTypeAPI({ ...data, imageUrl: imageUrl });

      queryClient.invalidateQueries({ queryKey: ["shelfs"] });

      toast.success("Tạo loại kệ thành công!");
      form.reset();

      setOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="btn-primary-gradient">
          <Plus className="mr-2" /> Thêm loại kệ
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50 border-b">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Layers className="text-blue-600" /> Cấu hình loại kệ mới
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 max-h-[70vh] overflow-y-auto bg-white">
          <FormProvider {...form}>
            <form
              id="form-create-shelf-type"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-10"
            >
              {/* SECTION 1: THÔNG TIN CƠ BẢN */}
              <section className="space-y-6">
                <header className="flex items-center gap-2 pb-2 border-b">
                  <ClipboardList size={18} className="text-slate-400" />
                  <h3 className="text-sm font-bold uppercase text-slate-600 tracking-wider">
                    Thông tin chung
                  </h3>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormFieldCustom
                    name="name"
                    label="Tên loại kệ"
                    placeholder="VD: Kệ gỗ 5 tầng..."
                  />
                  {/*Image */}
                  <div className="flex flex-col gap-2 ">
                    <span className="text-sm font-medium">Ảnh đại diện</span>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleSelectImage}
                    />
                    <div
                      onClick={() =>
                        !imagePreview && imageInputRef.current?.click()
                      }
                      className="relative h-37.5 w-37.5 border-2 border-dashed border-gray-300 rounded-xl
        flex items-center justify-center hover:border-blue-500 transition cursor-pointer bg-muted"
                    >
                      {imagePreview ? (
                        <>
                          <Image
                            src={imagePreview}
                            alt="preview"
                            fill
                            className="h-full w-auto object-cover rounded-xl"
                          />

                          <Button
                            type="button"
                            className="absolute top-2 right-2 w-8 h-8 rounded-md"
                            variant="outline"
                            onClick={handleRemoveImage}
                          >
                            <Trash2 className="text-red-500" size={18} />
                          </Button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <span className="text-sm">Thêm hình ảnh kệ</span>
                          <span className="text-xs text-gray-400 mt-1">
                            (PNG, JPG, JPEG)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/*end img */}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormFieldCustom
                    name="width"
                    label="Rộng (cm)"
                    type="number"
                  />
                  <FormFieldCustom
                    name="height"
                    label="Cao (cm)"
                    type="number"
                  />
                  <FormFieldCustom
                    name="depth"
                    label="Sâu (cm)"
                    type="number"
                  />
                  <FormFieldCustom
                    name="totalLevels"
                    label="Số tầng"
                    type="number"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Danh mục phù hợp (Chung cho kệ)
                  </label>
                  <MultiSelectCategory
                    name="suitableProductCategoryTypes"
                    options={categoryList}
                  />
                </div>

                <FormFieldCustom
                  name="displayGuideline"
                  label="Hướng dẫn trưng bày chung"
                  type="textarea"
                />
              </section>

              {/* SECTION 2: CHI TIẾT TỪNG TẦNG */}
              <section className="space-y-6">
                <header className="flex items-center gap-2 pb-2 border-b">
                  <Maximize size={18} className="text-blue-500" />
                  <h3 className="text-sm font-bold uppercase text-slate-600 tracking-wider">
                    Cấu hình chi tiết tầng
                  </h3>
                </header>

                <div className="grid gap-6">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-6 rounded-2xl border border-slate-200 bg-slate-50/30 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                          TẦNG {index + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormFieldCustom
                          name={`levels.${index}.name`}
                          label="Tên tầng"
                          placeholder="VD: Tầng đáy"
                        />
                        <FormFieldCustom
                          name={`levels.${index}.clearanceHeight`}
                          label="Chiều cao tầng (cm)"
                          type="number"
                        />
                        <FormFieldCustom
                          name={`levels.${index}.recommendedCapacity`}
                          label="Sức chứa (sản phẩm)"
                          type="number"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold mb-2 block">
                          Danh mục phù hợp cho tầng này
                        </label>
                        <MultiSelectCategory
                          name={`levels.${index}.suitableProductCategoryTypes`}
                          options={categoryList}
                        />
                      </div>

                      <FormFieldCustom
                        name={`levels.${index}.displayGuideline`}
                        label="Ghi chú trưng bày tầng"
                        placeholder="..."
                      />
                    </div>
                  ))}
                </div>
              </section>
            </form>
          </FormProvider>
        </div>

        <DialogFooter className="p-4 bg-slate-50 border-t">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="form-create-shelf-type"
            variant="success"
            className="px-10"
          >
            <Send className="mr-2 h-4 w-4" /> Lưu thông tin kệ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Component phụ trợ cho việc chọn nhiều Category (Tag style)
function MultiSelectCategory({
  name,
  options,
}: {
  name: string;
  options: ProductCategory[];
}) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value = [], onChange } }) => (
        <div className="flex flex-wrap gap-2">
          {options.map((cat) => {
            const isSelected = value.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  const newValue = isSelected
                    ? value.filter((id: string) => id !== cat.id)
                    : [...value, cat.id];
                  onChange(newValue);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300",
                )}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      )}
    />
  );
}

export default memo(CreateShelfTypeModal);
