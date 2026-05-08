import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/styles/components/ui/dialog";
import { formatDateTime } from "@/src/utils/format";
import { ImageIcon, ExternalLink } from "lucide-react";
import Image from "next/image";

type Medias = {
  id: string;
  mediaUrl: string;
  mediaType: string;
  purpose: string;
  createdAt: string;
  uploadedByUserId: string;
  uploadedByName: string;
};

export const ShipmentUrls = ({ mediaUrls }: { mediaUrls?: Medias[] }) => {
  const validMedias =
    mediaUrls?.filter((item) => item.mediaUrl && item.mediaUrl.trim() !== "") ||
    [];

  if (validMedias.length === 0) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-[12px] text-left text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mt-1 transition-all hover:underline">
          <ImageIcon className="h-3 w-3" />
          Xem hình ảnh giao & trả hàng ({validMedias?.length || 0})
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Hình ảnh giao & trả hàng
          </DialogTitle>
        </DialogHeader>

        <div
          className={`grid gap-4 mt-4 ${
            validMedias.length === 3 ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          {validMedias.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="group relative aspect-square rounded-xl border bg-slate-50 overflow-hidden hover:ring-2 hover:ring-primary transition-all">
                <Image
                  src={item.mediaUrl} // Next.js sẽ nhận string thật ở đây
                  alt={item.purpose || "evidence"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />

                <a
                  href={item.mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <ExternalLink className="text-white h-6 w-6" />
                </a>

                <div className="absolute top-2 left-2">
                  <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">
                    {item.purpose === "Pickup"
                      ? "Lấy hàng"
                      : item.purpose === "Delivery"
                        ? "Giao hàng"
                        : "Lấy hàng về"}
                  </span>
                </div>
              </div>

              <div className="px-1">
                <p className="text-[10px] text-gray-500">
                  {formatDateTime(item?.createdAt).full || ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
