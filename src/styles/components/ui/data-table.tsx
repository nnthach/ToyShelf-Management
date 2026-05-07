"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "./button";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  pageSize?: number;
  pageNumber?: number;
  totalCount?: number;
  totalPages?: number;

  children?: React.ReactNode;
  isLoading?: boolean;
  onPageChange?: (pageIndex: number) => void; // <--- thêm
}

export function DataTable<TData, TValue>({
  columns,
  data,
  children,
  pageSize = 10,
  pageNumber,
  totalCount,
  totalPages,
  isLoading,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const isServerPagination =
    totalPages !== undefined &&
    totalCount !== undefined &&
    pageNumber !== undefined;

  const [sorting, setSorting] = React.useState<SortingState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize,
        pageIndex: 0,
      },
    },
    getCoreRowModel: getCoreRowModel(),

    ...(isServerPagination
      ? {}
      : {
          getPaginationRowModel: getPaginationRowModel(),
        }),

    // sort
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    // end sort
  });

  // if server có pagesize
  const currentPage = isServerPagination
    ? pageNumber
    : table.getState().pagination.pageIndex + 1;

  const currentTotalPages = isServerPagination
    ? totalPages
    : table.getPageCount();

  const currentTotalCount = isServerPagination ? totalCount : data.length;

  return (
    <div>
      <div className="overflow-hidden rounded-md border bg-card">
        {children}
        <Table>
          <TableHeader className="bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không tìm thấy
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-4 border-t">
          {/* LEFT: Info */}
          <div className="text-sm text-muted-foreground">
            Hiển thị{" "}
            <span className="font-medium">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, currentTotalCount)}
            </span>{" "}
            / {currentTotalCount} mục
          </div>

          {/* RIGHT: Pagination */}
          <div className="flex items-center gap-1">
            {/* Prev */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (isServerPagination) {
                  onPageChange?.(currentPage - 1);
                } else {
                  table.previousPage();
                }
              }}
              disabled={currentPage <= 1}
            >
              ←
            </Button>

            {/* Page numbers */}
            {Array.from({ length: currentTotalPages }, (_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;

              return (
                <Button
                  key={page}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (isServerPagination) {
                      onPageChange?.(page);
                    } else {
                      table.setPageIndex(i);
                      onPageChange?.(page);
                    }
                  }}
                >
                  {page}
                </Button>
              );
            })}

            {/* Next */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (isServerPagination) {
                  onPageChange?.(currentPage + 1);
                } else {
                  table.nextPage();
                }
              }}
              disabled={currentPage >= currentTotalPages}
            >
              →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
