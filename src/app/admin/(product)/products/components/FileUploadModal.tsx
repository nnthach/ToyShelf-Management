import { useState } from "react";
import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/src/styles/components/ui/dialog";
import { Plus, Sparkles, Trash2, Upload } from "lucide-react";
import { getAllProductColorColorAPI } from "@/src/services/product.service";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/src/hooks/useDebounce";
import { ProductColorItem } from "@/src/types";
import { toast } from "react-toastify";
import {
  deleteFileUploadBySkuAPI,
  productFileUploadAPI,
} from "@/src/services/product-file-upload.service";
import { get } from "http";
import { getErrorMessage } from "@/src/utils/getErrorMessage";

function FileUploadModal() {
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ProductColorItem | null>(null);

  const debounce = useDebounce(search, 500);

  const { data: productColorList = [], isLoading } = useQuery({
    queryKey: ["productColor", debounce],
    queryFn: () => getAllProductColorColorAPI({ keyword: debounce }),
    select: (res) => res.data,
    enabled: !!debounce,
  });

  const handleUploadFile = async () => {
    if (!file) return;
    try {
      await productFileUploadAPI(file);
      toast.success("Tải tệp 3D thành công");
      setFile(null);
    } catch (error) {
      toast.error(getErrorMessage(error) || "Tải tệp 3D thất bại");
    }
  };

  // ===== Delete =====
  const handleDeleteFile = async () => {
    if (!selected) return;

    console.log("Deleting SKU:", selected.variantSku);

    try {
      await deleteFileUploadBySkuAPI(selected.variantSku);
      setSelected(null);
      setSearch("");
      toast.success("Xóa tệp 3D thành công");
    } catch (error) {
      toast.error(getErrorMessage(error) || "Xóa tệp 3D thất bại");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setFile(null);
          setSelected(null);
          setSearch("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"outline"}>Quản lý 3D sản phẩm</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] min-h-[300px] max-h-[500px] p-0 overflow-y-auto border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800">
            Quản lý 3D sản phẩm
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-amber-500" />
            Thêm hoặc xóa 3D sản phẩm
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* ================= CREATE ================= */}
          <div>
            <p className="font-semibold mb-2">Upload 3D</p>
            <div className="flex items-center gap-3">
              <input
                type="file"
                // accept=".glb,.gltf,.fbx,.obj,.bundle,.assetbundle"
                className="flex-1 border rounded-md px-3 py-2 text-sm cursor-pointer"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />

              <Button onClick={handleUploadFile} disabled={!file}>
                <Upload size={16} /> Upload
              </Button>
            </div>
            {file && <p className="mt-2 text-sm text-gray-500">{file.name}</p>}
          </div>

          {/* ================= DELETE ================= */}
          <div className="pb-12">
            <p className="font-semibold mb-2">Xóa theo SKU</p>
            <div className="relative">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelected(null);
                }}
                placeholder="Nhập SKU hoặc tên..."
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />

              {debounce && productColorList.length > 0 && !selected && (
                <div className="absolute z-50 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow-xl">
                  {productColorList.map((item: ProductColorItem) => (
                    <div
                      key={item.variantSku}
                      className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm border-b last:border-none"
                      onClick={() => {
                        setSelected(item);
                        setSearch(item.variantSku);
                      }}
                    >
                      <span className="font-medium">{item.variantSku}</span> -{" "}
                      {item.productName}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selected && (
              <div className="flex items-center justify-between mt-3 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-md animate-in fade-in duration-200">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-mono">
                    {selected.variantSku}
                  </span>
                  <span className="text-sm font-medium">
                    {selected.productName}
                  </span>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteFile}
                  className="h-8 shadow-sm"
                >
                  <Trash2 size={14} className="mr-1" />
                  Xóa
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FileUploadModal;
