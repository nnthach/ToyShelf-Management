"use client";

import { DataTable } from "@/src/styles/components/ui/data-table";
import { getStaffColumns } from "./columns";
import CreateStaffModal from "./components/CreateStaffModal";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import { getAllUserAPI } from "@/src/services/user.service";
import useQueryParams from "@/src/hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ViewUserModal from "./components/ViewUserModal";

export default function AdminUserManage() {
  const [selectedId, setSelectedId] = useState("");

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    roleBusiness: "",
  });

  const {
    data: staffList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["staffs", query],
    queryFn: () => getAllUserAPI(query),
    select: (res) => res.data,
  });

  const handleViewDetail = (userId: string) => {
    setSelectedId(userId);
  };

  const columns = getStaffColumns(handleViewDetail);

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý nhân viên
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách nhân viên trong hệ thống
          </p>
        </div>{" "}
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

      {selectedId && (
        <ViewUserModal
          userId={selectedId}
          isOpen={!!selectedId}
          onClose={() => {
            setSelectedId("");
          }}
        />
      )}
    </div>
  );
}
