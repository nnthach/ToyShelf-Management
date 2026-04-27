"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Box, DollarSign, Server, ShoppingCart } from "lucide-react";
import {
  getDashboardStoreInventoryStatCard,
  getDashboardStoreStatCard,
} from "@/src/services/dashboard.service";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import { useFilterStatCard } from "@/src/hooks/useFilterStatCard";
import FilterStatCard from "@/src/components/FilterStatCard";

function StoreStatCard({ storeId }: { storeId: string }) {
  const router = useRouter();

  const { query, updateQuery, isFiltered, resetDates, apiFormattedDates } =
    useFilterStatCard();

  const { data: storeStatCard } = useQuery({
    queryKey: ["storeStatCard", storeId, apiFormattedDates],
    queryFn: () => getDashboardStoreStatCard(apiFormattedDates, storeId),
    select: (res) => res.data,
    enabled: !!storeId,
  });

  const { data: storeStatCardInventory } = useQuery({
    queryKey: ["storeStatCardInventory", storeId],
    queryFn: () => getDashboardStoreInventoryStatCard(storeId),
    select: (res) => res.data,
    enabled: !!storeId,
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
          title="Doanh thu cửa hàng"
          value={`${(storeStatCard?.totalRevenue ?? 0).toLocaleString()} VND`}
          icon={DollarSign}
          color="bg-green-100 text-green-900"
          subTitle="Cập nhật theo bộ lọc"
        />

        <StatCardWithButton
          title="Đơn hàng"
          value={`${storeStatCard?.totalOrders || 0}`}
          icon={ShoppingCart}
          color="bg-orange-100 text-orange-900"
          action={() => router.push(`/manager/orders`)}
          subTitle="Cập nhật theo bộ lọc"
        />

        <StatCardWithButton
          title="Sản phẩm"
          value={`${storeStatCardInventory?.totalProducts || 0}`}
          icon={Box}
          color="bg-blue-100 text-blue-900"
          action={() => router.push(`/manager/inventory`)}
        />
        <StatCardWithButton
          title="Kệ"
          value={`${storeStatCardInventory?.totalShelves || 0}`}
          icon={Server}
          color="bg-red-100 text-red-900"
          action={() => router.push(`/manager/shelf-inventory`)}
        />
      </div>
    </div>
  );
}

export default StoreStatCard;
