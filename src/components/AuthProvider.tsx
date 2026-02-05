"use client";

import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../hooks/useAuth";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  useAuth();

  return <>{children}</>;
};
