"use client";

import useQueryParams from "@/src/hooks/useQueryParams";

import { useState } from "react";
import { Button } from "@/src/styles/components/ui/button";
import {
  Badge,
  Edit,
  Layers,
  Lock,
  Star,
  Trash2,
  Upload,
  Zap,
} from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CreatePartnerTierModal from "./components/CreateCommisionTableModal";
import {
  deleteCommissionTableAPI,
  disableCommissionTableAPI,
  getAllCommissionTableAPI,
  restoreCommissionTableAPI,
} from "@/src/services/commission-table.service";
import { CommissionTable } from "@/src/types";
import EditPriceTableModal from "./components/EditCommissionTableModal";
import CreateCommissionTableModal from "./components/CreateCommisionTableModal";
import { Card, CardContent, CardHeader } from "@/src/styles/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/styles/components/ui/table";
import { formatPartnerTierTextColor } from "@/src/utils/formatStatus";

const getTypeConfig = (type: string) => {
  switch (type) {
    case "Tier":
      return {
        bg: "bg-blue-50/50",
        border: "border-blue-100",
        badge: "bg-blue-500",
        text: "text-blue-700",
        icon: <Layers className="w-4 h-4" />,
        label: "Thông Thường",
      };
    case "Campaign":
      return {
        bg: "bg-orange-50/50",
        border: "border-orange-100",
        badge: "bg-orange-500",
        text: "text-orange-700",
        icon: <Zap className="w-4 h-4" />,
        label: "Chiến Dịch",
      };
    case "Special":
      return {
        bg: "bg-purple-50/50",
        border: "border-purple-100",
        badge: "bg-purple-500",
        text: "text-purple-700",
        icon: <Star className="w-4 h-4" />,
        label: "Đặc Biệt",
      };
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-200",
        badge: "bg-gray-500",
        text: "text-gray-700",
        icon: null,
        label: type,
      };
  }
};

export default function AdminCommissionTable() {
  const [selectedCommissionTableId, setSelectedCommissionTableId] =
    useState("");
  const queryClient = useQueryClient();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    order: "",
    search: "",
  });

  const {
    data: commissionTableList = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["commissionTables", query],
    queryFn: () => getAllCommissionTableAPI(query),
    select: (res) => res.data as CommissionTable[],
  });

  const handleEdit = (commissionId: string) => {
    setSelectedCommissionTableId(commissionId);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteCommissionTableAPI,
    onSuccess: () => {
      toast.success("Xóa thành công");

      queryClient.invalidateQueries({
        queryKey: ["commissionTables"],
      });
    },
    onError: () => {
      toast.error("Xóa thất bại");
    },
  });

  const handleDelete = (commissionId: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa bảng này không?",
    );

    if (!confirmDelete) return;

    deleteMutation.mutate(commissionId);
  };

  const disableMutation = useMutation({
    mutationFn: disableCommissionTableAPI,
    onSuccess: () => {
      toast.success("Vô hiệu hóa thành công");

      queryClient.invalidateQueries({
        queryKey: ["commissionTables"],
      });
    },
    onError: () => {
      toast.error("Vô hiệu hóa thất bại");
    },
  });

  const handleDisable = (commissionId: string) => {
    const confirmDisable = window.confirm(
      "Bạn có chắc muốn vô hiệu hóa bảng này không?",
    );

    if (!confirmDisable) return;

    disableMutation.mutate(commissionId);
  };

  const restoreMutation = useMutation({
    mutationFn: restoreCommissionTableAPI,
    onSuccess: () => {
      toast.success("Kích hoạt thành công");

      queryClient.invalidateQueries({
        queryKey: ["commissionTables"],
      });
    },
    onError: () => {
      toast.error("Kích hoạt thất bại");
    },
  });

  const handleRestore = (commissionId: string) => {
    restoreMutation.mutate(commissionId);
  };

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý bảng hoa hồng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách bảng hoa hồng trong hệ thống
          </p>
        </div>{" "}
        <CreateCommissionTableModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <div className="p-4 border-b flex justify-between items-center bg-white rounded-xl">
          {/*Filter search */}
          <FilterSearch
            query={query}
            loading={loading}
            resultCount={commissionTableList?.length || 0}
            onSearch={(val) => updateQuery({ search: val })}
            onApplyFilter={(filter) =>
              updateQuery({
                ...filter,
              })
            }
            onReset={() => resetQuery()}
            onRefresh={() => refetch()}
          />

          <Button variant={"outline"}>
            <Upload /> Xuất dữ liệu
          </Button>
        </div>

        {/* render card price table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {commissionTableList.map((table) => {
            const config = getTypeConfig(table.type);

            return (
              <Card
                key={table.id}
                className={`overflow-hidden border-2 transition-all py-0 gap-0 hover:shadow-lg ${config.border} flex flex-col`}
              >
                <CardHeader className={`${config.bg} border-b p-4 space-y-3`}>
                  {/* Dòng 1: Loại bảng giá */}
                  <div className="flex justify-between items-center">
                    <div
                      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${config.text}`}
                    >
                      {config.icon}
                      <span>Loại bảng: {config.label}</span>
                    </div>
                    <Badge
                      className={`${table.isActive ? "bg-green-500" : "bg-gray-400"} text-white border-none text-[10px] px-2`}
                    >
                      <span>
                        {table.isActive ? "ĐANG HOẠT ĐỘNG" : "TẠM NGƯNG"}
                      </span>
                    </Badge>
                  </div>

                  {/* Dòng 2: Tên bảng và Đối tượng áp dụng */}
                  <div>
                    <h3 className="font-extrabold text-xl text-gray-900 leading-tight">
                      {table.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <span className="font-medium text-gray-500 whitespace-nowrap">
                        Áp dụng cấp bậc đối tác:
                      </span>
                      {/* Gắn hàm format color vào đây */}
                      <span
                        className={`font-bold shadow-sm border border-black/5 ${formatPartnerTierTextColor(table.partnerTierName)}`}
                      >
                        {table.partnerTierName}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0 flex-grow">
                  <Table>
                    <TableHeader className="bg-gray-50/80">
                      <TableRow>
                        <TableHead className="pl-6 text-[11px] uppercase font-bold text-gray-400">
                          Danh mục sản phẩm
                        </TableHead>
                        <TableHead className="text-right pr-6 text-[11px] uppercase font-bold text-gray-400">
                          % Hoa hồng
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {table.items.map((item) => (
                        <TableRow
                          key={item.id}
                          className="hover:bg-gray-50/50 border-b last:border-0 transition-colors"
                        >
                          <TableCell className="pl-6 py-3">
                            <div className="flex flex-wrap gap-1.5">
                              {item.appliedCategories.map((cat) => (
                                <span
                                  key={cat.id}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-white border border-gray-200 text-gray-700 shadow-sm"
                                >
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-6 py-3">
                            <span className="text-xl font-black text-green-600">
                              {(item.commissionRate * 100).toFixed(0)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>

                {/* Footer Actions */}
                <div className="p-4 bg-white border-t flex items-center justify-between mt-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(table.id)}
                    className="h-9 px-3 gap-2 font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Xóa</span>
                  </Button>
                  {/* Nhóm bên phải: Kích hoạt/Vô hiệu hóa + Sửa */}
                  <div className="flex gap-2">
                    {table.isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisable(table.id)}
                        className="h-9 px-4 gap-2 font-semibold border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 transition-all shadow-sm"
                      >
                        <Lock className="w-4 h-4" />
                        Vô hiệu hóa
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(table.id)}
                        className="h-9 px-4 gap-2 font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-all shadow-sm"
                      >
                        <Zap className="w-4 h-4" />
                        Kích hoạt
                      </Button>
                    )}

                    <Button
                      variant="default" // Đổi sang default để nút Sửa là hành động chính rõ ràng nhất
                      size="sm"
                      onClick={() => handleEdit(table.id)}
                      className="h-9 px-4 gap-2 font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Sửa
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedCommissionTableId && (
        <EditPriceTableModal
          commissionTableId={selectedCommissionTableId}
          isOpen={!!selectedCommissionTableId}
          onClose={() => {
            setSelectedCommissionTableId("");
          }}
        />
      )}
    </div>
  );
}
