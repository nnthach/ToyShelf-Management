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

  const { on } = useSignalR({
    url: `${process.env.NEXT_PUBLIC_API_URL}/hubs/notification`,
    onConnected: () => console.log("SignalR connected"),
    onError: (err) => console.error("SignalR error:", err),
  });

  console.log("on", on);

  // Lắng nghe thông báo mới từ server
  useEffect(() => {
    const unsub = on<[string]>("ReceiveNotification", (userId: string) => {
      console.log("run unsub", userId);
      if (userId === user?.id) {
        queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      }
    });
    return unsub;

    console.log("unsub", unsub);
  }, [on, user?.id, queryClient]);

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
