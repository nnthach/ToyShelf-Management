"use client";

import useQueryParams from "@/src/hooks/useQueryParams";

import { useState } from "react";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
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
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý cấp bậc đối tác
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách cấp bậc đối tác trong hệ thống
          </p>
        </div>{" "}
        <CreatePartnerTierModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={partnerTierList ?? []}
          isLoading={loading}
        />
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
