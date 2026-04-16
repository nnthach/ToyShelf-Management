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
        setStatus("connected");
        onConnected?.();
      })
      .catch((err: Error) => {
        setStatus("error");
        onError?.(err);
        console.error("SignalR connection error:", err);
      });

    return () => {
      connection.stop();
      connectionRef.current = null;
    };
  }, [url]);

  const invoke = useCallback(
    async <T = void>(
      method: string,
      ...args: unknown[]
    ): Promise<T | undefined> => {
      const conn = connectionRef.current;
      if (conn?.state === signalR.HubConnectionState.Connected) {
        return conn.invoke<T>(method, ...args);
      }
      console.warn("SignalR: invoke called but not connected");
      return undefined;
    },
    [],
  );

  const on = useCallback(
    <T extends unknown[]>(event: string, handler: (...args: T) => void) => {
      connectionRef.current?.on(event, handler as (...args: unknown[]) => void);
      return () =>
        connectionRef.current?.off(
          event,
          handler as (...args: unknown[]) => void,
        );
    },
    [],
  );

  return { status, invoke, on };
}
