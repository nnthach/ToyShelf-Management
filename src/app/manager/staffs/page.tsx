"use client";
import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { getStaffColumns } from "./columns";
import CreateStaffModal from "./components/CreateStaffModal";
import FilterSearch from "./components/FilterSearch";
import { useAuth } from "@/src/hooks/useAuth";
import { getAllPartnerStaffAPI } from "@/src/services/user.service";
import useQueryParams from "@/src/hooks/useQueryParams";
import { DataTable } from "@/src/styles/components/ui/data-table";

export default function ManagerManageStaff() {
  const { myStore } = useAuth();

  const storeId = myStore?.storeId;

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    storeId: storeId,
    storeRole: "",
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

  const columns = getStaffColumns();

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý nhân viên cửa hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách tất cả các nhân viên của cửa hàng
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
