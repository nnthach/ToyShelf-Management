"use client";

import useQueryParams from "@/src/hooks/useQueryParams";

import { useState } from "react";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import useFetchList from "@/src/hooks/useFetchList";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import { PartnerTier } from "@/src/types";
import {
  deletePartnerTierAPI,
  getAllPartnerTierAPI,
} from "@/src/services/partner-tier.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getPartnerTierColumns } from "./columns";
import CreatePartnerTierModal from "./components/CreatePartnerLevelModal";
import EditPartnerTierModal from "./components/EditPartnerTierModal";

export default function AdminPartnerLevel() {
  const [selectedPartnerTierId, setSelectedPartnerTierId] = useState("");
  const queryClient = useQueryClient();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    order: "",
    search: "",
  });

  const {
    data: partnerTierList = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["partnerTiers", query],
    queryFn: () => getAllPartnerTierAPI(query),
    select: (res) => res.data,
  });

  const handleEdit = (tierId: string) => {
    setSelectedPartnerTierId(tierId);
  };

  const deleteMutation = useMutation({
    mutationFn: deletePartnerTierAPI,
    onSuccess: () => {
      toast.success("Xóa thành công");

      // reload danh sách
      queryClient.invalidateQueries({
        queryKey: ["partnerTiers"],
      });
    },
    onError: () => {
      toast.error("Xóa thất bại");
    },
  });

  const handleDelete = (tierId: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa cấp bậc đối tác này không?",
    );

    if (!confirmDelete) return;

    deleteMutation.mutate(tierId);
  };

  const columns = getPartnerTierColumns(handleEdit, handleDelete);

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý cấp bậc đối tác</h1>
        <CreatePartnerTierModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={partnerTierList ?? []}
          isLoading={loading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={loading}
              resultCount={partnerTierList.length}
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

      {selectedPartnerTierId && (
        <EditPartnerTierModal
          tierId={selectedPartnerTierId}
          isOpen={!!selectedPartnerTierId}
          onClose={() => {
            setSelectedPartnerTierId("");
          }}
        />
      )}
    </div>
  );
}
