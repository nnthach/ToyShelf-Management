"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../styles/components/ui/dialog";
import { FormFieldCustom } from "../styles/components/custom/FormFieldCustom";
import { Button } from "../styles/components/ui/button";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useRef, useState } from "react";
import { getMyProfileAPI, updateMyProfileAPI } from "../services/user.service";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { uploadFileToCloudinary } from "../config/cloundinary";
import { setUser } from "../redux/slice/authSlice";
import LoadingPageComponent from "./LoadingPageComponent";

function AccountAdminProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const formSchema = z.object({
    fullName: z.string().min(1, "Không được để trống"),
    avatarUrl: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user?.fullName || "",
        avatarUrl: user?.avatarUrl || "",
      });
    }
  }, [user, form]);

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

    // reset input để chọn lại cùng file
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

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const imageUrl = imageFile
        ? await uploadFileToCloudinary(imageFile, "user")
        : null;
      await updateMyProfileAPI({ ...data, avatarUrl: imageUrl });

      const roles: string[] = JSON.parse(localStorage.getItem("roles") ?? "[]");

      const fetchProfileRes = await getMyProfileAPI();

      const payload = {
        ...fetchProfileRes.data,
        roles,
      };

      dispatch(setUser(payload));
      toast.success("Cập nhật thông tin thành công");
      onClose();
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <LoadingPageComponent />}
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            form.reset();
            onClose();
          }
        }}
      >
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle>Thông tin cá nhân</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
              id="form-edit-profile"
            >
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
                      <img
                        src={imagePreview}
                        alt="preview"
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
                      <span className="text-sm">Thêm hình ảnh</span>
                      <span className="text-xs text-gray-400 mt-1">
                        (PNG, JPG, JPEG)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/*end img */}

              <FormFieldCustom
                name="fullName"
                label="Tên đầy đủ"
                placeholder="Nguyen Van A"
              />
            </form>
          </FormProvider>
          <DialogFooter>
            <Button type="submit" form="form-edit-profile">
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AccountAdminProfileModal;
