"use client";

import useQueryParams from "@/src/hooks/useQueryParams";

import { useState } from "react";
import { Button } from "@/src/styles/components/ui/button";
import { Upload } from "lucide-react";
import FilterSearch from "./components/FilterSearch";
import { QueryParams } from "@/src/types/SubType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { City } from "@/src/types";
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

  const {
    data: cityList = [],
    isLoading: loading,
    refetch,
  } = useQuery({
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
        <div>
          <h1 className="text-2xl font-bold dark:text-foreground">
            Quản lý danh sách thành phố
          </h1>
          <p className="text-gray-500 dark:text-gray-200">
            Danh sách tất cả các thành phố trong hệ thống
          </p>
        </div>
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
              onRefresh={() => refetch()}
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
