"use client";

import { useAppSelector } from "../redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface RolePermissionProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RolePermission: React.FC<RolePermissionProps> = ({
  allowedRoles,
  children,
}) => {
  const { warehouse } = useAuth();

  const { isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [token] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });

  const [roles] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("roles") ?? "[]");
  });

  useEffect(() => {
    if (isLoading) return;

    if (!token) {
      router.replace("/");
      return;
    }

    const hasPermission = roles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      if (roles.includes("Supervisor")) {
        router.replace("/supervisor/dashboard");
      } else if (roles.includes("Admin")) {
        router.replace("/admin/dashboard");
      } else if (roles.includes("PartnerAdmin")) {
        router.replace("/partner/dashboard");
      } else if (roles.includes("Partner")) {
        router.replace("/manager/dashboard");
      } else if (
        roles.includes("Warehouse") &&
        warehouse?.warehouseRole === "Manager"
      ) {
        router.replace("/warehouse/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [roles, token, isLoading]);

  if (isLoading) return null;

  const hasPermission = roles.some((role) => allowedRoles.includes(role));

  if (!hasPermission) return null;

  return <>{children}</>;
};
