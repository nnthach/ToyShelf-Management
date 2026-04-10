import { Button } from "@/src/styles/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/styles/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Sparkles } from "lucide-react";
import { memo, useState } from "react";

function CreateReturnModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          //   form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="btn-primary-gradient">
          <Plus /> Tạo đơn trả hàng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header đồng bộ */}
        <DialogHeader className="p-6 bg-slate-50/50 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Tạo đơn trả hàng
          </DialogTitle>
          <DialogDescription className="text-slate-500 flex items-center gap-1.5 mt-1">
            <Sparkles size={14} className="text-amber-500" />
            Tìm kiếm sản phầm cần trả
          </DialogDescription>
        </DialogHeader>

        {/*footer*/}
        <div className="p-4 border-t bg-white">
          <DialogFooter className="gap-2">
            <Button variant="outline">Đóng cửa sổ</Button>

            <Button variant="success">Xác nhận đã nhận hàng</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(CreateReturnModal);
