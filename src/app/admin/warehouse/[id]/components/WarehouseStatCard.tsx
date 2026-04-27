import FilterStatCard from "@/src/components/FilterStatCard";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import { useFilterStatCard } from "@/src/hooks/useFilterStatCard";
import { getDashboardWarehouseStatCard } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Box, PackageCheck, Server } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

function WarehouseStatCard({
  warehouseId,
  inventoryLocationId,
}: {
  warehouseId: string;
  inventoryLocationId: string;
}) {
  const router = useRouter();

  const { query, updateQuery, isFiltered, resetDates, apiFormattedDates } =
    useFilterStatCard();

  const { data: warehouseStatCard } = useQuery({
    queryKey: ["warehouseStatCard", warehouseId],
    queryFn: () =>
      getDashboardWarehouseStatCard(apiFormattedDates, warehouseId!),
    select: (res) => res.data,
    enabled: !!warehouseId,
  });

  return (
    <div className="space-y-4">
      <FilterStatCard
        query={query}
        updateQuery={updateQuery}
        isFiltered={isFiltered}
        resetDates={resetDates}
      />

      {/* Danh sách Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCardWithButton
          title="Đơn giao hàng"
          value={warehouseStatCard?.totalOrders}
          icon={PackageCheck}
          color="bg-green-100 text-green-900"
        />
        <StatCardWithButton
          title="Hàng trong kho"
          value={warehouseStatCard?.totalInventory}
          icon={Box}
          color="bg-blue-100 text-blue-900"
          action={() =>
            router.push(
              `/admin/all-inventory?locationId=${inventoryLocationId}`,
            )
          }
        />
        <StatCardWithButton
          title="Kệ trong kho"
          value={warehouseStatCard?.totalShelves}
          icon={Server}
          color="bg-orange-100 text-orange-900"
          action={() =>
            router.push(
              `/admin/shelf-inventory?locationId=${inventoryLocationId}`,
            )
          }
        />
      </div>
    </div>
  );
}

export default memo(WarehouseStatCard);
