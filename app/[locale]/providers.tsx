"use client"; // Mark this as a Client Component

import { store } from "@/shared/redux/store";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/shared/components/AuthProvider";
import { AccountAdminModalProvider } from "@/shared/context/AccountAdminModalContext";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <AccountAdminModalProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </AccountAdminModalProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
