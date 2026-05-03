import FilterStatCard from "@/src/components/FilterStatCard";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import { useAuth } from "@/src/hooks/useAuth";
import { useFilterStatCard } from "@/src/hooks/useFilterStatCard";
import { getDashboardWarehouseStatCard } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Box, Server, ShoppingCart, Truck } from "lucide-react";
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
          title="Đơn giao hàng"
          value={warehouseStatCard?.totalOrders}
          icon={Truck}
          color="bg-blue-100 text-blue-900"
          action={() => router.push(`/warehouse/refill-stocks`)}
          subTitle="Cập nhật theo bộ lọc"
        />
        <StatCardWithButton
          title="Hàng Tại kho"
          value={warehouseStatCard?.totalInventory}
          icon={Box}
          color="bg-red-100 text-red-900"
          action={() => router.push(`/warehouse/inventory`)}
          subTitle="Cập nhật theo bộ lọc"
        />
        <StatCardWithButton
          title="Kệ Tại Kho"
          value={warehouseStatCard?.totalShelves}
          icon={Server}
          color="bg-orange-100 text-orange-900"
          action={() => router.push(`/warehouse/shelf-inventory`)}
          subTitle="Cập nhật theo bộ lọc"
        />
      </div>
    </div>
  );
}

export default memo(WarehouseStatCard);
