"use client";
import { useAppSelector } from "../redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RolePermissionProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RolePermission: React.FC<RolePermissionProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const token = localStorage.getItem("token");
  const roles: string[] = JSON.parse(localStorage.getItem("roles") ?? "[]");

  const checkPermission = () => {
    if (isLoading) return;

    if (!roles) return;

    if (!user && token) return;
    if (!user && !token) {
      router.replace("/");
      return;
    }

    const hasPermission =
      user && roles.some((role) => allowedRoles.includes(role));

    if (user && !hasPermission) {
      if (roles?.includes("Supervisor")) {
        router.replace("/supervisor/dashboard");
      } else if (roles?.includes("Admin")) {
        router.replace("/admin/dashboard");
      } else if (roles?.includes("PartnerAdmin")) {
        router.replace("/partner/dashboard");
      } else {
        router.replace("/");
      }
      return;
    }
  };

  useEffect(() => {
    checkPermission();
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};
