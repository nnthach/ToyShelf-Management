"use client";

import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../hooks/useAuth";
import LoadingProjectComponent from "./LoadingProjectComponent";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { initAuth, isLoading } = useAuth();

  useEffect(() => {
    initAuth();
  }, []);

  if (isLoading) return <LoadingProjectComponent />;

  return <>{children}</>;
};
