import * as signalR from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import { Notification } from "../types";
import { useQueryClient } from "@tanstack/react-query";

type UseSignalROptions = {
  userId?: string;
  role: string;
  onSystemMessage?: (msg: string) => void;
  onNotification?: (data: Notification) => void;
};

export function useSignalR({
  userId,
  role,
  onSystemMessage,
  onNotification,
}: UseSignalROptions) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const queryClient = useQueryClient();

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

    connectionRef.current = connection;

    if (onSystemMessage) {
      connection.on("ReceiveSystemMessage", onSystemMessage);
    }

    if (onNotification) {
      connection.on("ReceiveNewNotification", onNotification);
      console.log("onNotification", onNotification);
    }

    connection.onreconnected(async () => {
      console.log("Reconnected");
      await connection.invoke("JoinSystem", userId, role);
    });

    const start = async () => {
      try {
        await connection.start();
        console.log("Connected");

        await connection.invoke("JoinSystem", userId, role);
      } catch (err) {
        console.error("SignalR error:", err);
      }
    };

    start();

    return () => {
      connection.stop();
    };
  }, [userId, role, onSystemMessage, onNotification]);

  return connectionRef;
}
