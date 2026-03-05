"use client";

import { useAccountAdminModal } from "@/src/context/AccountAdminModalContext";
import AccountAdminProfileModal from "../AccountAdminProfileModal";
import AccountAdminPasswordModal from "../AccountAdminPasswordModal";
import PartnerAdminSidebar from "./PartnerAdminSidebar";
import PartnerAdminNavbar from "./PartnerAdminNavbar";

export function PartnerAdminClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isProfileOpen, isChangePasswordOpen, closeAll } =
    useAccountAdminModal();

  return (
    <>
      <PartnerAdminSidebar />
      <main className="flex-1">
        <PartnerAdminNavbar />
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
