"use client";

import useQueryParams from "@/src/hooks/useQueryParams";

import { useState } from "react";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CreatePartnerTierModal from "./components/CreatePriceTableModal";
import {
  deletePriceTableAPI,
  getAllPriceTableAPI,
} from "@/src/services/price-table.service";
import { PriceTable } from "@/src/types";
import EditPriceTableModal from "./components/EditPriceTableModal";

const getTypeStyle = (type: string) => {
  switch (type) {
    case "Tier":
      return {
        bg: "bg-blue-50",
        badge: "bg-blue-500",
        text: "text-blue-700",
      };
    case "Campaign":
      return {
        bg: "bg-orange-50",
        badge: "bg-orange-500",
        text: "text-orange-700",
      };
    case "Special":
      return {
        bg: "bg-purple-50",
        badge: "bg-purple-500",
        text: "text-purple-700",
      };
    default:
      return {
        bg: "bg-gray-50",
        badge: "bg-gray-500",
        text: "text-gray-700",
      };
  }
};

export default function AdminPriceTable() {
  const [selectedPriceTableId, setSelectedPriceTableId] = useState("");
  const queryClient = useQueryClient();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    order: "",
    search: "",
  });

  const {
    data: priceTableList = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["priceTables", query],
    queryFn: () => getAllPriceTableAPI(query),
    select: (res) => res.data as PriceTable[],
  });

  const handleEdit = (tierId: string) => {
    setSelectedPriceTableId(tierId);
  };

  const deleteMutation = useMutation({
    mutationFn: deletePriceTableAPI,
    onSuccess: () => {
      toast.success("Xóa thành công");

      // reload danh sách
      queryClient.invalidateQueries({
        queryKey: ["priceTables"],
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

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý bảng giá hoa hồng</h1>
        <CreatePartnerTierModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <div className="p-4 border-b flex justify-between items-center bg-white rounded-xl">
          {/*Filter search */}
          <FilterSearch
            query={query}
            loading={loading}
            resultCount={priceTableList?.length || 0}
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

        {/*render card price table */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {priceTableList.map((table) => {
            const style = getTypeStyle(table.type);

            return (
              <div
                key={table.id}
                className={`rounded-xl border p-5 shadow-sm ${style.bg} transition hover:shadow-md`}
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{table.name}</h2>
                    <p className="text-sm text-gray-500">
                      {table.partnerTierName}
                    </p>
                  </div>

                  <span
                    className={`text-white text-xs px-3 py-1 rounded-full ${style.badge}`}
                  >
                    {table.type}
                  </span>
                </div>

                {/* Items */}
                <div className="mt-4 space-y-2">
                  {table.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm bg-white p-2 rounded-md"
                    >
                      <span>{item.priceSegmentName}</span>
                      <span className="font-medium">
                        {item.commissionRate}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(table.id)}
                  >
                    Sửa
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(table.id)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPriceTableId && (
        <EditPriceTableModal
          priceTableId={selectedPriceTableId}
          isOpen={!!selectedPriceTableId}
          onClose={() => {
            setSelectedPriceTableId("");
          }}
        />
      )}
    </div>
  );
}
