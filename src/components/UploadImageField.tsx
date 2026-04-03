import Image from "next/image";
import { Button } from "../styles/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useRef } from "react";

interface ImageUploadFieldProps {
  value: File | string | null;
  preview: string | null;
  error?: string;
  onChange: (file: File | null, preview: string | null) => void;
}

export function ImageUploadField({
  value,
  preview,
  error,
  onChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warn("Vui lòng chọn hình ảnh");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onChange(file, previewUrl);

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null, null);

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Hình ảnh kệ</span>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleSelectImage}
      />

      <div
        onClick={() => !preview && inputRef.current?.click()}
        className="relative h-37.5 w-37.5 border-2 border-dashed border-gray-300 rounded-xl
        flex items-center justify-center hover:border-blue-500 transition cursor-pointer bg-muted"
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="preview"
              fill
              className="h-full w-auto object-cover rounded-xl"
            />

            <Button
              type="button"
              className="absolute top-2 right-2 w-8 h-8 rounded-md"
              variant="outline"
              onClick={handleRemove}
            >
              <Trash2 className="text-red-500" size={18} />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <span className="text-sm">Thêm hình ảnh kệ</span>
            <span className="text-xs text-gray-400 mt-1">(PNG, JPG, JPEG)</span>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-[-2px]">{error}</p>}
    </div>
  );
}
