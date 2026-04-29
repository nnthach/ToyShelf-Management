import { getMonthlySettlementPendingAmountAPI } from "@/src/services/monthly-settlement.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/styles/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Landmark } from "lucide-react";
import { memo } from "react";

interface BankInfoModalProps {
  partnerId?: string;
  isOpen: boolean;
  onClose: () => void;
  data: {
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
  } | null;
}

function BankInfoModal({
  isOpen,
  onClose,
  data,
  partnerId,
}: BankInfoModalProps) {
  // Fetch dữ liệu tiền chưa thanh toán
  const { data: detailPendingAmount, isLoading } = useQuery({
    queryKey: ["detailPendingAmount", partnerId],
    queryFn: () => getMonthlySettlementPendingAmountAPI(partnerId!),
    select: (res) => res.data,
    enabled: !!partnerId && isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-white/10 text-white p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between uppercase tracking-[0.2em] text-xs font-black text-blue-400">
            <div className="flex items-center gap-2">
              <Landmark size={16} />
              Thông tin thanh toán
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* PHẦN CHƯA THANH TOÁN - Hiển thị nổi bật phía trên */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">
              Số tiền cần thanh toán
            </p>
            <p className="text-xl font-bold text-rose-500">
              {isLoading ? (
                <span className="animate-pulse text-slate-500 italic text-sm">
                  Đang tải...
                </span>
              ) : (
                `${detailPendingAmount?.unsettledAmount?.toLocaleString("vi-VN") || "0"} ₫`
              )}
            </p>
          </div>

          {/* THẺ NGÂN HÀNG */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 p-6 relative overflow-hidden shadow-2xl border border-white/10">
            {/* Thẻ Chip giả lập */}
            <div className="w-11 h-8 bg-gradient-to-tr from-yellow-200 to-yellow-500 rounded-md mb-8 opacity-90 shadow-inner"></div>

            <div className="space-y-5 relative z-10">
              <div>
                <p className="text-[10px] uppercase text-white/50 font-bold tracking-widest mb-1">
                  Ngân hàng
                </p>
                <p className="text-lg font-bold uppercase tracking-tight italic">
                  {data?.bankName || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase text-white/50 font-bold tracking-widest mb-1">
                  Số tài khoản
                </p>
                <p className="text-2xl font-mono font-bold tracking-[0.15em] drop-shadow-md">
                  {data?.bankAccountNumber || "•••• •••• ••••"}
                </p>
              </div>

              <div className="flex justify-between items-end pt-2 border-t border-white/10">
                <div>
                  <p className="text-[10px] uppercase text-white/50 font-bold tracking-widest mb-1">
                    Chủ tài khoản
                  </p>
                  <p className="font-bold uppercase tracking-wider text-sm">
                    {data?.bankAccountName || "N/A"}
                  </p>
                </div>
                <CreditCard size={28} className="opacity-30 text-white" />
              </div>
            </div>

            {/* Decor nền */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(BankInfoModal);
