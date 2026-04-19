"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { cn } from "../../lib/utils";

export function SidebarRailCustom() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        "absolute inset-y-0 right-0 z-20 w-3",
        "flex items-center justify-center",
        "group",
      )}
    >
      {/* Dải xanh */}
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-[2px]",
          "bg-blue-400 opacity-0 group-hover:opacity-100",
          "transition-opacity duration-200",
        )}
      />

      {/* Icon nhô ra ngoài sidebar */}
      <span
        className={cn(
          "absolute left-full -translate-x-1/2", // nhô ra ngoài
          "flex h-5 w-5 items-center justify-center",
          "rounded-full bg-white border border-slate-200 shadow-md",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          "top-1/2 -translate-y-1/2",
        )}
      >
        {open ? (
          <ChevronLeft size={12} className="text-slate-600" />
        ) : (
          <ChevronRight size={12} className="text-slate-600" />
        )}
      </span>
    </button>
  );
}
