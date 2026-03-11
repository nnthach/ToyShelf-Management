"use client";

import { DataTable } from "../../../../styles/components/ui/data-table";
import { Button } from "../../../../styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import useQueryParams from "../../../../hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { QueryParams } from "@/src/types/SubType";
import { getAllPartnerAPI } from "@/src/services/partner.service";
import { getStaffColumns } from "./columns";
import CreateStaffModal from "./components/CreateStaffModal";
import FilterSearch from "./components/FilterSearch";
import { useAuth } from "@/src/hooks/useAuth";
import { getAllPartnerStaffAPI } from "@/src/services/user.service";
import { getAllStoreAPI } from "@/src/services/store.service";
import { Store } from "@/src/types";

export default function PartnerManageStaff() {
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const { partner } = useAuth();

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

  const handleViewDetail = (partnerId: string) => {
    setSelectedStaffId(partnerId);
  };

  const columns = getStaffColumns(handleViewDetail);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Quản lý nhân viên</h1>
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
