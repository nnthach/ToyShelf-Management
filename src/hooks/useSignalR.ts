import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";

interface UseSignalROptions {
  url: string;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
}

export type SignalRStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export function useSignalR({
  url,
  onConnected,
  onDisconnected,
  onError,
}: UseSignalROptions) {
  const [status, setStatus] = useState<SignalRStatus>("connecting");
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (connectionRef.current) return;

    let isCancelled = false; // ← flag này

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;

    connection.onclose(() => {
      setStatus("disconnected");
      onDisconnected?.();
    });
    connection.onreconnecting(() => setStatus("connecting"));
    connection.onreconnected(() => {
      setStatus("connected");
      onConnected?.();
    });

    connection
      .start()
      .then(() => {
        if (isCancelled) return; // ← nếu đã bị cleanup thì bỏ qua
        setStatus("connected");
        onConnected?.();
      })
      .catch((err: Error) => {
        if (isCancelled) return; // ← bỏ qua lỗi do cleanup gây ra
        setStatus("error");
        onError?.(err);
        console.error("SignalR connection error:", err);
      });

    return () => {
      isCancelled = true; // ← đánh dấu đã cleanup
      connectionRef.current = null;
      connection.stop(); // stop sau khi set null để tránh reuse
    };
  }, [url]);

  const on = useCallback(
    <T extends unknown[]>(event: string, handler: (...args: T) => void) => {
      const conn = connectionRef.current;
      if (!conn) return () => {};

      conn.on(event, handler as (...args: unknown[]) => void);
      return () => conn.off(event, handler as (...args: unknown[]) => void);
    },
    [],
  );

  return { status, on };
}
