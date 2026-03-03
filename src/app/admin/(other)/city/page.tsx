"use client";

import useQueryParams from "@/src/hooks/useQueryParams";

import { useState } from "react";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CreatePartnerTierModal from "./components/CreateCityModal";
import {
  deletePriceTableAPI,
  getAllPriceTableAPI,
} from "@/src/services/price-table.service";
import { City, PriceTable } from "@/src/types";
import EditPriceTableModal from "./components/EditCityModal";
import { deleteCityAPI, getAllCityAPI } from "@/src/services/city.service";
import { DataTable } from "@/src/styles/components/ui/data-table";
import { getCityColumns } from "./columns";
import CreateCityModal from "./components/CreateCityModal";
import EditCityModal from "./components/EditCityModal";

export default function AdminManageCity() {
  const [selectedCityId, setSelectedCityId] = useState("");
  const queryClient = useQueryClient();

  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    order: "",
    search: "",
  });

  const { data: cityList = [], isLoading: loading } = useQuery({
    queryKey: ["cities", query],
    queryFn: () => getAllCityAPI(query),
    select: (res) => res.data as City[],
  });

  const handleEdit = (cityId: string) => {
    setSelectedCityId(cityId);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteCityAPI,
    onSuccess: () => {
      toast.success("Xóa thành công");

      // reload danh sách
      queryClient.invalidateQueries({
        queryKey: ["cities"],
      });
    },
    onError: () => {
      toast.error("Xóa thất bại");
    },
  });

  const handleDelete = (cityId: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa thành phố này không?",
    );

    if (!confirmDelete) return;

    deleteMutation.mutate(cityId);
  };

  const columns = getCityColumns(handleEdit, handleDelete);

  return (
    <div>
      {/*Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold ">Quản lý danh sách thành phố</h1>
        <CreateCityModal />
      </div>
      {/*Table */}
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={cityList ?? []} isLoading={loading}>
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={loading}
              resultCount={cityList.length}
              onSearch={(val) => updateQuery({ search: val })}
              onApplyFilter={(filter) =>
                updateQuery({
                  ...filter,
                })
              }
              onReset={() => resetQuery()}
            />

            <Button variant={"outline"}>
              <Upload /> Xuất dữ liệu
            </Button>
          </div>
        </DataTable>
      </div>

      {selectedCityId && (
        <EditCityModal
          cityId={selectedCityId}
          isOpen={!!selectedCityId}
          onClose={() => {
            setSelectedCityId("");
          }}
        />
      )}
    </div>
  );
}
