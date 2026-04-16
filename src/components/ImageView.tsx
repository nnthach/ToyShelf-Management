import { ImageIcon, ExternalLink } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../styles/components/ui/dialog";

interface DamageMediaViewProps {
  mediaUrls?: string[];
  productName?: string;
}

export const ImageView = ({ mediaUrls, productName }: DamageMediaViewProps) => {
  if (!mediaUrls || mediaUrls.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-[12px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mt-1 transition-all hover:underline">
          <ImageIcon className="h-3 w-3" />
          Xem hình ảnh trả hàng ({mediaUrls.length})
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Hình ảnh minh chứng:{" "}
            <span className="text-primary">{productName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {mediaUrls.map((url, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-xl border bg-slate-50 overflow-hidden hover:ring-2 hover:ring-primary transition-all"
            >
              <Image
                src={url}
                alt={`Evidence ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <ExternalLink className="text-white h-6 w-6" />
              </a>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
