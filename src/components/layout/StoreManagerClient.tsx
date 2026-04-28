"use client";

import { useAccountAdminModal } from "@/src/context/AccountAdminModalContext";
import AccountAdminProfileModal from "../AccountAdminProfileModal";
import AccountAdminPasswordModal from "../AccountAdminPasswordModal";
import StoreManagerSidebar from "./StoreManagerSidebar";
import StoreManagerNavbar from "./StoreManagerNavbar";
import { useSignalR } from "@/src/hooks/useSignalR";
import { useAuth } from "@/src/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export function StoreManagerClientShell({
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
