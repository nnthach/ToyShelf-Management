"use client";

import { Button } from "@/src/styles/components/ui/button";
import React from "react";

interface PaginationProps {
  currentPage: number; // Page hiện tại (bắt đầu từ 1)
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 0,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-4 py-4 border-t bg-white">
      {/* LEFT: Info - Hiển thị thông tin tiến trình */}
      <div className="text-sm text-muted-foreground">
        Hiển thị{" "}
        <span className="font-medium">{totalItems > 0 ? startItem : 0}</span>
        {" - "}
        <span className="font-medium">{endItem}</span>
        {" / "}
        {totalItems} mục
      </div>

      {/* RIGHT: Pagination - Các nút điều hướng */}
      <div className="flex items-center gap-1">
        {/* Nút Prev */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <span className="sr-only">Trang trước</span>←
        </Button>

        {/* Danh sách số trang */}
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <Button
              key={page}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`h-8 px-3 pb-0.5 text-xs ${
                isActive
                  ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {page}
            </Button>
          );
        })}

        {/* Nút Next */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <span className="sr-only">Trang sau</span>→
        </Button>
      </div>
    </div>
  );
}
