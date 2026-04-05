import { memo, useEffect, useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ClipboardList, Send, Layers, Maximize } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/styles/components/ui/dialog";
import { Button } from "@/src/styles/components/ui/button";
import { FormFieldCustom } from "@/src/styles/components/custom/FormFieldCustom";
import { createShelfTypeAPI } from "@/src/services/shelf.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProductCategoryAPI } from "@/src/services/product-category.service";
import { toast } from "react-toastify";
import { uploadFileToCloudinary } from "@/src/config/cloundinary";
import { ImageUploadField } from "@/src/components/UploadImageField";
import {
  createShelfSchema,
  CreateShelfFormValues,
} from "@/src/schemas/shelf.schema";
import MultiSelectCategory from "./MuiltiSelectCategory";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";

function CreateShelfTypeModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: categoryList = [] } = useQuery({
    queryKey: ["productCategories"],
    queryFn: () => getAllProductCategoryAPI({ isActive: true }),
    select: (res) => res.data,
  });

  const form = useForm<CreateShelfFormValues>({
    resolver: zodResolver(createShelfSchema),
    defaultValues: {
      imageFile: undefined,
      imageUrl: "",
      name: "",
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
          displayGuideline: "",
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

  const validateSubLevelCateType = (data: CreateShelfFormValues) => {
    const parentCats = data.suitableProductCategoryTypes;

    for (let i = 0; i < data.levels.length; i++) {
      const invalid = data.levels[i].suitableProductCategoryTypes.filter(
        (cat) => !parentCats.includes(cat),
      );

      if (invalid.length > 0) {
        toast.error(`Tầng ${i + 1} có danh mục không hợp lệ`);
        return false;
      }
    }
    return true;
  };

  // submit form
  async function onSubmit(data: CreateShelfFormValues) {
    const isValid = validateSubLevelCateType(data);
    if (!isValid) return;

    setIsLoading(true);

    try {
      const imageUrl = data.imageFile
        ? await uploadFileToCloudinary(data.imageFile, "shelf")
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

  if (isLoading) {
    return <LoadingPageComponent />;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) form.reset();

        setImageFile(null);
        setImagePreview(null);
      }}
    >
      <DialogTrigger asChild>
        <Button className="btn-primary-gradient">
          <Plus className="mr-2" /> Thêm loại kệ
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50 border-b">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Layers className="text-blue-600" /> Thêm loại kệ mới
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 py-2 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white">
          <FormProvider {...form}>
            <form
              id="form-create-shelf-type"
              className="space-y-10"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* SECTION 1: THÔNG TIN CƠ BẢN */}
              <section className="space-y-6">
                <header className="flex items-center gap-2 pb-2 border-b">
                  <ClipboardList size={18} className="text-slate-400" />
                  <h3 className="text-sm font-bold uppercase text-slate-600 tracking-wider">
                    Thông tin chung
                  </h3>
                </header>

                <div className="flex flex-col gap-4">
                  <FormFieldCustom
                    name="name"
                    label="Tên loại kệ"
                    placeholder="VD: Kệ gỗ 5 tầng..."
                  />
                  <ImageUploadField
                    value={imageFile}
                    preview={imagePreview}
                    error={form.formState.errors.imageFile?.message}
                    onChange={(file, preview) => {
                      if (file) {
                        form.setValue("imageFile", file, {
                          shouldValidate: true,
                        });
                      }
                      setImageFile(file);
                      setImagePreview(preview);
                    }}
                  />
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
                          Tầng {index + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormFieldCustom
                          name={`levels.${index}.name`}
                          label="Thứ tự tầng"
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
            <Send className="mr-2 h-4 w-4" /> Xác nhận thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CreateShelfTypeModal);
