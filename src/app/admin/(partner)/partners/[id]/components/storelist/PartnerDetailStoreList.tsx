import { DataTable } from "@/src/styles/components/ui/data-table";
import { memo } from "react";
import { getPartnerDetailStoreColumns } from "./columns";
import useQueryParams from "@/src/hooks/useQueryParams";
import { QueryParams } from "@/src/types/SubType";
import { getAllStoreAPI } from "@/src/services/store.service";
import { useQuery } from "@tanstack/react-query";
import FilterSearch from "./FilterSearch";
import { getAllCityAPI } from "@/src/services/city.service";
import { Store } from "@/src/types";

function PartnerDetailStoreList({ partnerId }: { partnerId: string }) {
  const { query, updateQuery, resetQuery } = useQueryParams<QueryParams>({
    isActive: undefined,
    keyword: "",
    companyid: partnerId,
    cityId: "",
  });

  const {
    data: storeList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["stores", query],
    queryFn: () => getAllStoreAPI(query),
    select: (res) => res.data as Store[],
  });
  const columns = getPartnerDetailStoreColumns();

  const { data: cityList = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: () => getAllCityAPI({}),
    select: (res) => res.data,
  });

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Danh sách cửa hàng</h1>
      <div className="container mx-auto">
        <DataTable
          columns={columns}
          data={storeList ?? []}
          pageSize={5}
          isLoading={isLoading}
        >
          <div className="p-4 border-b flex justify-between items-center">
            {/*Filter search */}
            <FilterSearch
              query={query}
              loading={isLoading}
              resultCount={storeList.length}
              cityList={cityList}
              onSearch={(val) => updateQuery({ keyword: val })}
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

export default memo(PartnerDetailStoreList);
