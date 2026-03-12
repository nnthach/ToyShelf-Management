"use client";

import { useAccountAdminModal } from "@/src/context/AccountAdminModalContext";
import AccountAdminProfileModal from "../AccountAdminProfileModal";
import AccountAdminPasswordModal from "../AccountAdminPasswordModal";
import WarehouseSidebar from "./WarehouseSidebar";
import WarehouseNavbar from "./WarehouseNavbar";

export function WarehouseClientShell({ children }: { children: React.ReactNode }) {
  const { isProfileOpen, isChangePasswordOpen, closeAll } =
    useAccountAdminModal();

  return (
    <>
      <WarehouseSidebar />
      <main className="flex-1">
        <WarehouseNavbar />
        <div className="px-4 mt-4">{children}</div>
      </main>

      <AccountAdminProfileModal open={isProfileOpen} onClose={closeAll} />
      <AccountAdminPasswordModal
        open={isChangePasswordOpen}
        onClose={closeAll}
      />
    </>
  );
}
