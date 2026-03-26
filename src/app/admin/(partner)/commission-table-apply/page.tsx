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

import { getCommissionPolicyColumns } from "./columns";
import EditCommissionPolicyModal from "./components/EditCommissionPolicyModal";
import CreateCommissionPolicyModal from "./components/CreateCommissionPolicyModal";
import { getAllCommissionTableAPI } from "@/src/services/commission-table.service";

export default function AdminCommissionPolicy() {
  const [selectedCommissionPolicyId, setSelectedCommissionPolicyId] =
    useState("");
  const queryClient = useQueryClient();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    order: "",
    search: "",
  });

  const {
    data: commissionPolicyList = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["commissionPolicies", query],
    queryFn: () =>getAllCommissionTableAPI(query),
    select: (res) => res.data,
  });

  const handleEdit = (commissionPolicyId: string) => {
    setSelectedCommissionPolicyId(commissionPolicyId);
  };




  const columns = getCommissionPolicyColumns(handleEdit);

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
              onRefresh={() => refetch()}
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
