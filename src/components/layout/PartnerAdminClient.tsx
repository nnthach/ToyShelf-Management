"use client";

import { useAccountAdminModal } from "@/src/context/AccountAdminModalContext";
import AccountAdminProfileModal from "../AccountAdminProfileModal";
import AccountAdminPasswordModal from "../AccountAdminPasswordModal";
import PartnerAdminSidebar from "./PartnerAdminSidebar";
import PartnerAdminNavbar from "./PartnerAdminNavbar";
import { useSignalR } from "@/src/hooks/useSignalR";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/src/hooks/useAuth";

export function PartnerAdminClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isProfileOpen, isChangePasswordOpen, closeAll } =
    useAccountAdminModal();
  const { user } = useAuth();
  const userId = user?.id;

  const queryClient = useQueryClient();

  useSignalR({
    userId,
    role: "PartnerAdmin",
    onSystemMessage: (msg) => {
      console.log("SYSTEM:", msg);
    },
    onNotification: (data) => {
      console.log("NOTI:", data);
      queryClient.invalidateQueries({
        queryKey: ["notifications", userId],
      });
    },
  });

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
