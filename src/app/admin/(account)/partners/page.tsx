"use client";

import { DataTable } from "../../../../styles/components/ui/data-table";
import { Button } from "../../../../styles/components/ui/button";
import { Download, Upload } from "lucide-react";
import useQueryParams from "../../../../hooks/useQueryParams";
import { getPartnerColumns } from "./columns";
import CreatePartnerModal from "./components/CreatePartnerModal";
import FilterSearch from "./components/FilterSearch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ViewDetailSheet from "./components/ViewDetailSheet";
import { QueryParams } from "@/src/types/SubType";
import { getAllPartnerAPI } from "@/src/services/partner.service";

export default function AdminPartnerManage() {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    null,
  );

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    order: "",
    search: "",
  });

  const { data: partnerList = [], isLoading } = useQuery({
    queryKey: ["partners", query],
    queryFn: () => getAllPartnerAPI(query),
    select: (res) => res.data,
  });

  const handleViewDetail = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
  };

  const columns = getPartnerColumns(handleViewDetail);

  return (
    <>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Quản lý đối tác</h1>
        <CreatePartnerModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={partnerList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={partnerList.length}
              onSearch={(val) => updateQuery({ search: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
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

      <ViewDetailSheet
        partnerId={selectedPartnerId}
        isOpen={!!selectedPartnerId}
        onClose={() => setSelectedPartnerId(null)}
      />
    </>
  );
}
