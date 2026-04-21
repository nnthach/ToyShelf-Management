import FilterStatCard from "@/src/components/FilterStatCard";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import { useAuth } from "@/src/hooks/useAuth";
import { useFilterStatCard } from "@/src/hooks/useFilterStatCard";
import { getDashboardWarehouseStatCard } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Box, Server, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

function WarehouseStatCard() {
  const router = useRouter();

  const { warehouse } = useAuth();
  const warehouseId = warehouse?.warehouseId;

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
          title="Đơn hàng"
          value={warehouseStatCard?.totalOrders}
          icon={ShoppingCart}
          color="bg-green-100 text-green-900"
          action={() => router.push(`/warehouse/refill-stocks`)}
        />
        <StatCardWithButton
          title="Hàng Tồn kho"
          value={warehouseStatCard?.totalInventory}
          icon={Box}
          color="bg-blue-100 text-blue-900"
          action={() => router.push(`/warehouse/inventory`)}
        />
        <StatCardWithButton
          title="Kệ Tồn Kho"
          value={warehouseStatCard?.totalShelves}
          icon={Server}
          color="bg-purple-100 text-purple-900"
          action={() => router.push(`/warehouse/shelf-inventory`)}
        />
      </div>
    </div>
  );
}

export default memo(WarehouseStatCard);
