"use client";

import { useAccountAdminModal } from "@/src/context/AccountAdminModalContext";
import AccountAdminProfileModal from "../AccountAdminProfileModal";
import AccountAdminPasswordModal from "../AccountAdminPasswordModal";
import StoreManagerSidebar from "./StoreManagerSidebar";
import StoreManagerNavbar from "./StoreManagerNavbar";

export function StoreManagerClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isProfileOpen, isChangePasswordOpen, closeAll } =
    useAccountAdminModal();

  return (
    <>
      <StoreManagerSidebar />
      <main className="flex-1">
        <StoreManagerNavbar />
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
