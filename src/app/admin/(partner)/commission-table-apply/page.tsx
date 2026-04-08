"use client";

import useQueryParams from "@/src/hooks/useQueryParams";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCommissionTableApplyColumns } from "./columns";
import CreateCommissionPolicyModal from "./components/CreateCommissionTableApplyModal";
import {
  disableCommissionTableApplyAPI,
  getAllCommissionTableApplyAPI,
  restoreCommissionTableApplyAPI,
} from "@/src/services/commission-table-apply.service";
import { toast } from "react-toastify";

export default function AdminCommissionTableApply() {
  const queryClient = useQueryClient();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    order: "",
    search: "",
  });

  const {
    data: commissionTableApplyList = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["commissionTableApplies", query],
    queryFn: () => getAllCommissionTableApplyAPI(query),
    select: (res) => res.data,
  });

  const disableMutation = useMutation({
    mutationFn: disableCommissionTableApplyAPI,
    onSuccess: () => {
      toast.success("Vô hiệu hóa thành công");

      queryClient.invalidateQueries({
        queryKey: ["commissionTableApplies"],
      });
    },
    onError: () => {
      toast.error("Vô hiệu hóa thất bại");
    },
  });

  const handleDisable = (commissionId: string) => {
    const confirmDisable = window.confirm(
      "Bạn có chắc muốn vô hiệu hóa không?",
    );

    if (!confirmDisable) return;

    disableMutation.mutate(commissionId);
  };

  const restoreMutation = useMutation({
    mutationFn: restoreCommissionTableApplyAPI,
    onSuccess: () => {
      toast.success("Kích hoạt thành công");

      queryClient.invalidateQueries({
        queryKey: ["commissionTableApplies"],
      });
    },
    onError: () => {
      toast.error("Kích hoạt thất bại");
    },
  });

  const handleRestore = (commissionId: string) => {
    restoreMutation.mutate(commissionId);
  };

  const columns = getCommissionTableApplyColumns(handleRestore, handleDisable);

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý bảng hoa hồng áp dụng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách bảng hoa hồng được áp dụng cho đối tác trong hệ thống
          </p>
        </div>{" "}
        <CreateCommissionPolicyModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={commissionTableApplyList ?? []}
          isLoading={loading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={loading}
              resultCount={commissionTableApplyList.length}
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
        </DataTable>
      </div>
    </div>
  );
}
