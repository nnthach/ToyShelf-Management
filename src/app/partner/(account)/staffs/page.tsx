"use client";

import { DataTable } from "@/src/styles/components/ui/data-table";
import { Button } from "@/src/styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import useQueryParams from "../../../../hooks/useQueryParams";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { QueryParams } from "@/src/types/SubType";
import { getAllPartnerAPI } from "@/src/services/partner.service";
import { getStaffColumns } from "./columns";
import CreateStaffModal from "./components/CreateStaffModal";
import FilterSearch from "./components/FilterSearch";
import { useAuth } from "@/src/hooks/useAuth";
import {
  disableUserAPI,
  getAllPartnerStaffAPI,
  restoreUserAPI,
} from "@/src/services/user.service";
import { getAllStoreAPI } from "@/src/services/store.service";
import { Store } from "@/src/types";
import { toast } from "react-toastify";

export default function PartnerManageStaff() {
  const { partner } = useAuth();
  const queryClient = useQueryClient();
  const partnerId = partner?.partnerId;

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    partnerId: partnerId || "",
    storeId: "",
    storeRole: "",
    isActive: undefined,
    order: "",
  });

  const {
    data: staffList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["staffs", query],
    queryFn: () => getAllPartnerStaffAPI(query),
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

  // disable
  const disableMutation = useMutation({
    mutationFn: disableUserAPI,
    onSuccess: () => {
      toast.success("Vô hiệu hóa thành công");

      queryClient.invalidateQueries({
        queryKey: ["staffs"],
      });
    },
    onError: () => {
      toast.error("Vô hiệu hóa thất bại");
    },
  });

  const handleDisable = (roleId: string) => {
    const confirmDisable = window.confirm(
      "Bạn có chắc muốn vô hiệu hóa chức vụ này không?",
    );

    if (!confirmDisable) return;

    disableMutation.mutate(roleId);
  };
  // restore
  const restoreMutation = useMutation({
    mutationFn: restoreUserAPI,
    onSuccess: () => {
      toast.success("Kích hoạt thành công");

      queryClient.invalidateQueries({
        queryKey: ["staffs"],
      });
    },
    onError: () => {
      toast.error("Kích hoạt thất bại");
    },
  });

  const handleRestore = (roleId: string) => {
    restoreMutation.mutate(roleId);
  };

  const columns = getStaffColumns(handleDisable, handleRestore);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý nhân viên
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách tất cả các nhân viên của các cửa hàng
          </p>
        </div>
        <CreateStaffModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={staffList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={staffList.length}
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
          </div>
        </DataTable>
      </div>
    </>
  );
}
