"use client";

import { DataTable } from "../../../../styles/components/ui/data-table";
import { Button } from "../../../../styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import useQueryParams from "../../../../hooks/useQueryParams";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { QueryParams } from "@/src/types/SubType";
import { getAllPartnerAPI } from "@/src/services/partner.service";
import FilterSearch from "./components/FilterSearch";
import CreateStoreInviteModal from "./components/CreateStoreInviteModal";
import { toast } from "react-toastify";
import { deleteProductColorDetailAPI } from "@/src/services/product-color.service";
import { getStoreInviteColumns } from "./columns";
import { getStoreInvitesAPI } from "@/src/services/store-invite.service";
import { useAuth } from "@/src/hooks/useAuth";
import { getAllStoreAPI } from "@/src/services/store.service";
import { Store } from "@/src/types";

export default function PartnerManageStoreInvites() {
  const queryClient = useQueryClient();

  const { partner } = useAuth();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    status: "",
    order: "",
    storeId: "",
    partnerId: partner?.partnerId,
  });

  const {
    data: storeInviteList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["storeInvites", query],
    queryFn: () => getStoreInvitesAPI(query),
    select: (res) => res.data,
  });

  const { data: storeList = [] } = useQuery({
    queryKey: ["stores"],
    queryFn: () => getAllStoreAPI({}),
    select: (res) => res.data as Store[],
  });

  const storeOptions = storeList.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  const deleteMutation = useMutation({
    mutationFn: deleteProductColorDetailAPI,
    onSuccess: () => {
      toast.success("Xóa lời mời thành công");

      // reload danh sách
      queryClient.invalidateQueries({
        queryKey: ["storeInvites"],
      });
    },
    onError: () => {
      toast.error("Xóa lời mời thất bại");
    },
  });

  const handleDelete = (inviteId: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa lời mời này không?",
    );

    if (!confirmDelete) return;

    deleteMutation.mutate(inviteId);
  };

  const columns = getStoreInviteColumns(handleDelete);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">
          Quản lý lời mời tham gia cửa hàng
        </h1>
        <CreateStoreInviteModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={storeInviteList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={storeInviteList.length}
              storeOptions={storeOptions}
              onSearch={(val) => updateQuery({ search: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
              onRefresh={() => refetch()}
            />

            <div className="space-x-3">
              <Button>
                <Download /> Nhập dữ liệu
              </Button>
              <Button variant={"outline"}>
                <Upload /> Xuất dữ liệu
              </Button>
            </div>
          </div>
        </DataTable>
      </div>
    </>
  );
}
