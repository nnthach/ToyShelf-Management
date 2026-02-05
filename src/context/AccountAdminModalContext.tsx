"use client";

import { createContext, useContext, useState } from "react";

type AccountAdminModalContextType = {
  openProfile: () => void;
  openChangePassword: () => void;
  closeAll: () => void;
  isProfileOpen: boolean;
  isChangePasswordOpen: boolean;
};

const AccountAdminModalContext =
  createContext<AccountAdminModalContextType | null>(null);

export const AccountAdminModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <AccountAdminModalContext.Provider
      value={{
        isProfileOpen,
        isChangePasswordOpen,
        openProfile: () => setProfileOpen(true),
        openChangePassword: () => setChangePasswordOpen(true),
        closeAll: () => {
          setProfileOpen(false);
          setChangePasswordOpen(false);
        },
      }}
    >
      {children}
    </AccountAdminModalContext.Provider>
  );
};

export const useAccountAdminModal = () => {
  const ctx = useContext(AccountAdminModalContext);
  if (!ctx) {
    throw new Error(
      "useAccountAdminModal must be used within AccountAdminModalProvider",
    );
  }
  return ctx;
};
