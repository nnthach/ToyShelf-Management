"use client";

import { useAccountAdminModal } from "@/src/context/AccountAdminModalContext";
import AccountAdminProfileModal from "../AccountAdminProfileModal";
import AccountAdminPasswordModal from "../AccountAdminPasswordModal";
import PartnerAdminSidebar from "./PartnerAdminSidebar";
import PartnerAdminNavbar from "./PartnerAdminNavbar";
import { useSignalR } from "@/src/hooks/useSignalR";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/src/hooks/useAuth";
import * as signalR from "@microsoft/signalr";

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

  // Lắng nghe thông báo mới từ server
  useEffect(() => {
    if (!userId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://toyshelf.io.vn/hubs/notification", {
        transport: signalR.HttpTransportType.LongPolling,
        skipNegotiation: false,
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveSystemMessage", (msg) => {
      console.log("SYSTEM:", msg);
    });

    connection.on("ReceiveNewNotification", (data) => {
      console.log("NOTI:", data);
    });

    connection.onreconnected(async () => {
      console.log("Reconnected");
      await connection.invoke("JoinSystem", userId, "PartnerAdmin");
    });

    async function start() {
      await connection.start();
      console.log("Connected");

      await connection.invoke("JoinSystem", userId, "PartnerAdmin");
    }

    start();

    return () => {
      connection.stop();
    };
  }, [userId]);
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
