"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/styles/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getMyWarehouseProfileAPI } from "@/src/services/user.service";
import { formatDateTime } from "@/src/utils/format";

type ViewUserModalProps = {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
};

function ViewUserModal({ userId, isOpen, onClose }: ViewUserModalProps) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getMyWarehouseProfileAPI({ userId }),
    select: (res) => res.data?.[0],
    enabled: !!userId && isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thông tin nhân viên</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-4 text-center text-sm text-slate-500">
            Đang tải...
          </div>
        ) : user ? (
          <div className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Họ tên:</span>
              <span className="col-span-3">{user?.fullName}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Email:</span>
              <span className="col-span-3">{user?.email}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Trạng thái:</span>
              <span className="col-span-3">
                {user?.userIsActive ? (
                  <span className="text-green-600">Đang hoạt động</span>
                ) : (
                  <span className="text-red-600">Ngừng hoạt động</span>
                )}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Kho:</span>
              <span className="col-span-3">{user?.warehouseName}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Vai trò:</span>
              <span className="col-span-3">
                {user?.warehouseRole === "Manager"
                  ? "Quản lý kho"
                  : user?.warehouseRole === "Shipper"
                    ? "Nhân viên giao hàng"
                    : user?.warehouseRole}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-semibold">Ngày tạo:</span>
              <span className="col-span-3">
                {formatDateTime(user?.userCreatedAt || "").full}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-sm text-red-500">
            Không tìm thấy dữ liệu.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ViewUserModal;
