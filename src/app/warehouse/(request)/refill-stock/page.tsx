"use client";

import { Download, Upload } from "lucide-react";
import useQueryParams from "@/src/hooks/useQueryParams";
import { Button } from "@/src/styles/components/ui/button";
import FilterSearch from "./components/FilterSearch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryParams } from "@/src/types/SubType";
import { ShipmentAssign } from "@/src/types";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getShipmentAssignColumnColumns } from "./columns";
import { useState } from "react";
import { getAllShipmentAssignAPI } from "@/src/services/shipment-assignment.service";
import UpdateShipmentAssignRefillRequestModal from "./components/UpdateShipmentAssignRefillRequestModal";
import { useAuth } from "@/src/hooks/useAuth";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";

export default function WarehouseRefillRequestManage() {
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const { warehouse } = useAuth();

  const warehouseLocationId = warehouse?.warehouseLocationIds[0];

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    type: "",
    status: "",
    warehouseLocationId: warehouseLocationId,
  });

  const {
    data: shipmentAssignList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["shipmentAssignRequests", query],
    queryFn: () => getAllShipmentAssignAPI(query),
    select: (res) => res.data as ShipmentAssign[],
  });

  const handleEdit = (shipmentAssignId: string) => {
    setSelectedRequestId(shipmentAssignId);
  };

  const columns = getShipmentAssignColumnColumns(handleEdit);

  if (!query.warehouseLocationId) {
    return <LoadingPageComponent />;
  }

  return (
    <>
      {/*Header */}
      <div>
        <h1 className="text-2xl font-bold dark:text-foreground">
          Quản lý đơn đặt hàng từ cửa hàng
        </h1>
        <p className="text-gray-500 dark:text-gray-200">
          Danh sách tất cả các đơn đặt hàng từ cửa hàng
        </p>{" "}
      </div>

      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={shipmentAssignList ?? []}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={shipmentAssignList.length}
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

      {selectedRequestId && (
        <UpdateShipmentAssignRefillRequestModal
          requestId={selectedRequestId}
          isOpen={!!selectedRequestId}
          onClose={() => {
            setSelectedRequestId("");
          }}
        />
      )}
    </>
  );
}
