"use client";

import { useAccountAdminModal } from "@/shared/context/AccountAdminModalContext";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AccountAdminProfileModal from "../AccountAdminProfileModal";
import AccountAdminPasswordModal from "../AccountAdminPasswordModal";

export function AdminClientShell({ children }: { children: React.ReactNode }) {
  const { isProfileOpen, isChangePasswordOpen, closeAll } =
    useAccountAdminModal();

  return (
    <>
      <AdminSidebar />
      <main className="flex-1">
        <AdminNavbar />
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
