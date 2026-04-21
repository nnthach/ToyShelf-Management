"use client";

import FilterStatCard from "@/src/components/FilterStatCard";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import { useFilterStatCard } from "@/src/hooks/useFilterStatCard";
import { getDashboardAdminStatCard } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart, Store, Users } from "lucide-react";
import { useRouter } from "next/navigation";

function AdminStatCard() {
  const router = useRouter();

  const { query, updateQuery, isFiltered, resetDates, apiFormattedDates } =
    useFilterStatCard();

  const { data: adminStatCard } = useQuery({
    queryKey: ["adminStatCard", apiFormattedDates],
    queryFn: () => getDashboardAdminStatCard(apiFormattedDates),
    select: (res) => res.data,
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
          title="Doanh thu"
          value={`${(adminStatCard?.totalRevenue ?? 0).toLocaleString() || 0} VND`}
          icon={DollarSign}
          color="bg-green-100 text-green-900"
        />

        <StatCardWithButton
          title="Đơn hàng"
          value={`${adminStatCard?.totalOrders || 0}`}
          icon={ShoppingCart}
          color="bg-orange-100 text-orange-900"
          action={() => router.push(`/admin/orders`)}
        />
        <StatCardWithButton
          title="Đối tác"
          value={`${adminStatCard?.totalPartners || 0}`}
          icon={Users}
          color="bg-blue-100 text-blue-900"
          action={() => router.push(`/admin/partners`)}
        />
        <StatCardWithButton
          title="Cửa hàng"
          value={`${adminStatCard?.totalStores || 0}`}
          icon={Store}
          color="bg-purple-100 text-purple-900"
          action={() => router.push(`/admin/stores`)}
        />
      </div>
    </div>
  );
}

export default AdminStatCard;
