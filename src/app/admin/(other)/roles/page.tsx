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
  deleteRoleAPI,
  disableRoleAPI,
  getAllRoleAPI,
  restoreRoleAPI,
} from "@/src/services/role.service";
import CreateRoleModal from "./components/CreateRoleModal";
import EditRoleModal from "./components/EditRoleModal";
import { getRoleColumns } from "./columns";

export default function AdminManageRole() {
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const queryClient = useQueryClient();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    order: "",
    search: "",
  });

  const {
    data: roleList = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["roles", query],
    queryFn: () => getAllRoleAPI(query),
    select: (res) => res.data,
  });

  const handleEdit = (tierId: string) => {
    setSelectedRoleId(tierId);
  };

  // delete
  const deleteMutation = useMutation({
    mutationFn: deleteRoleAPI,
    onSuccess: () => {
      toast.success("Xóa thành công");

      // reload danh sách
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
    onError: () => {
      toast.error("Xóa thất bại");
    },
  });

  const handleDelete = (roleId: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa cấp bậc vai trò này không?",
    );

    if (!confirmDelete) return;

    deleteMutation.mutate(roleId);
  };

  // disable
  const disableMutation = useMutation({
    mutationFn: disableRoleAPI,
    onSuccess: () => {
      toast.success("Vô hiệu hóa thành công");

      queryClient.invalidateQueries({
        queryKey: ["roles"],
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
    mutationFn: restoreRoleAPI,
    onSuccess: () => {
      toast.success("Kích hoạt thành công");

      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
    onError: () => {
      toast.error("Kích hoạt thất bại");
    },
  });

  const handleRestore = (roleId: string) => {
    restoreMutation.mutate(roleId);
  };

  const columns = getRoleColumns(handleEdit, handleDelete,handleDisable, handleRestore);

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý chức vụ vai trò
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách tất cả các chức vụ vai trò trong hệ thống
          </p>
        </div>{" "}
        <CreateRoleModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={roleList ?? []}
          isLoading={loading}
        />
      </div>

      {selectedRoleId && (
        <EditRoleModal
          roleId={selectedRoleId}
          isOpen={!!selectedRoleId}
          onClose={() => {
            setSelectedRoleId("");
          }}
        />
      )}
    </div>
  );
}
