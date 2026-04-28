"use client";

import { useAccountAdminModal } from "@/src/context/AccountAdminModalContext";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AccountAdminProfileModal from "../AccountAdminProfileModal";
import AccountAdminPasswordModal from "../AccountAdminPasswordModal";
import { useSignalR } from "@/src/hooks/useSignalR";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/src/hooks/useAuth";

export function AdminClientShell({ children }: { children: React.ReactNode }) {
  const { isProfileOpen, isChangePasswordOpen, closeAll } =
    useAccountAdminModal();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

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
