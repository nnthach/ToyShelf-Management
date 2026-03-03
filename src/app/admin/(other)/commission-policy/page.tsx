"use client";

import useQueryParams from "@/src/hooks/useQueryParams";

import { useState } from "react";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  deleteCommissionPolicyAPI,
  getAllCommissionPolicyAPI,
} from "@/src/services/commission-policy.service";
import { getCommissionPolicyColumns } from "./columns";
import EditCommissionPolicyModal from "./components/EditCommissionPolicyModal";
import CreateCommissionPolicyModal from "./components/CreateCommissionPolicyModal";

export default function AdminCommissionPolicy() {
  const [selectedCommissionPolicyId, setSelectedCommissionPolicyId] =
    useState("");
  const queryClient = useQueryClient();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    order: "",
    search: "",
  });

  const { data: commissionPolicyList = [], isLoading: loading } = useQuery({
    queryKey: ["commissionPolicies", query],
    queryFn: () => getAllCommissionPolicyAPI(query),
    select: (res) => res.data,
  });

  const handleEdit = (commissionPolicyId: string) => {
    setSelectedCommissionPolicyId(commissionPolicyId);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteCommissionPolicyAPI,
    onSuccess: () => {
      toast.success("Xóa thành công");

      // reload danh sách
      queryClient.invalidateQueries({
        queryKey: ["commissionPolicies"],
      });
    },
    onError: () => {
      toast.error("Xóa thất bại");
    },
  });

  const handleDelete = (commissionPolicyId: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa chính sách hoa hồng này không?",
    );

    if (!confirmDelete) return;

    deleteMutation.mutate(commissionPolicyId);
  };

  const columns = getCommissionPolicyColumns(handleEdit, handleDelete);

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý chính sách hoa hồng</h1>
        <CreateCommissionPolicyModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={commissionPolicyList ?? []}
          isLoading={loading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={loading}
              resultCount={commissionPolicyList.length}
              onSearch={(val) => updateQuery({ search: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
            />

            <Button variant={"outline"}>
              <Upload /> Xuất dữ liệu
            </Button>
          </div>
        </DataTable>
      </div>

      {selectedCommissionPolicyId && (
        <EditCommissionPolicyModal
          commissionPolicyId={selectedCommissionPolicyId}
          isOpen={!!selectedCommissionPolicyId}
          onClose={() => {
            setSelectedCommissionPolicyId("");
          }}
        />
      )}
    </div>
  );
}
