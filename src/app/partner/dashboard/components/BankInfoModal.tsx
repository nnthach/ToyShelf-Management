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
      <DialogContent className="sm:max-w-[425px] bg-white text-slate-900 p-0 overflow-hidden border border-slate-200 shadow-2xl rounded-3xl">
        {/* HEADER: Nền trắng, chữ xanh */}
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between uppercase tracking-[0.2em] text-xs font-black text-blue-600">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-50">
                <Landmark size={18} strokeWidth={2.5} />
              </div>
              Thông tin thanh toán
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* PHẦN THANH TOÁN: Tone trắng/xám nhạt */}
          <div className="flex flex-col gap-3">
            {/* Số tiền chưa quyết toán */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-slate-100/50 hover:border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1.5">
                Số tiền chưa quyết toán
              </p>
              <div className="text-2xl font-extrabold text-rose-600 flex items-baseline gap-1">
                {isLoading ? (
                  <div className="h-8 w-36 bg-slate-200 animate-pulse rounded-lg" />
                ) : (
                  <>
                    <span>
                      {detailPendingAmount?.unsettledAmount?.toLocaleString(
                        "vi-VN",
                      ) || "0"}
                    </span>
                    <span className="text-base font-semibold opacity-80">
                      ₫
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Số tiền chờ thanh toán */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-slate-100/50 hover:border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1.5">
                Số tiền chờ thanh toán
              </p>
              <div className="text-2xl font-extrabold text-amber-600 flex items-baseline gap-1">
                {isLoading ? (
                  <div className="h-8 w-36 bg-slate-200 animate-pulse rounded-lg" />
                ) : (
                  <>
                    <span>
                      {detailPendingAmount?.pendingSettlementAmount?.toLocaleString(
                        "vi-VN",
                      ) || "0"}
                    </span>
                    <span className="text-base font-semibold opacity-80">
                      ₫
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* THẺ NGÂN HÀNG: Gradient xanh dương nhẹ nhàng */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 relative overflow-hidden shadow-lg shadow-blue-500/20 border border-blue-600/20 text-white">
            <div className="space-y-5 relative z-10">
              <div>
                <p className="text-[10px] uppercase text-white/70 font-bold tracking-widest mb-1">
                  Ngân hàng
                </p>
                <p className="text-lg font-bold uppercase tracking-tight italic drop-shadow-sm">
                  {data?.bankName || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase text-white/70 font-bold tracking-widest mb-1">
                  Số tài khoản
                </p>
                <p className="text-2xl font-mono font-bold tracking-[0.15em] drop-shadow-md">
                  {data?.bankAccountNumber || "•••• •••• ••••"}
                </p>
              </div>

              <div className="flex justify-between items-end pt-3 border-t border-white/20">
                <div>
                  <p className="text-[10px] uppercase text-white/70 font-bold tracking-widest mb-1">
                    Chủ tài khoản
                  </p>
                  <p className="font-bold uppercase tracking-wider text-sm drop-shadow-sm">
                    {data?.bankAccountName || "N/A"}
                  </p>
                </div>
                {/* Thêm một icon nhỏ trang trí cho thẻ */}
                <Landmark
                  size={24}
                  className="text-white/30"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Decor nền: Chuyển sang màu trắng trong suốt */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -top-10 w-24 h-24 bg-blue-400/30 rounded-full blur-2xl"></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(BankInfoModal);
