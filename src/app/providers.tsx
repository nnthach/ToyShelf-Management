"use client"; // Mark this as a Client Component

import { store } from "@/src/redux/store";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/src/components/AuthProvider";
import { AccountAdminModalProvider } from "@/src/context/AccountAdminModalContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
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
    </GoogleOAuthProvider>
  );
}
