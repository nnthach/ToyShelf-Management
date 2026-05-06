import FilterStatCard from "@/src/components/FilterStatCard";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import { useFilterStatCard } from "@/src/hooks/useFilterStatCard";
import {
  getDashboardAdminStatCard,
  getDashboardAdminStatCardV2,
} from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart, Store, Users } from "lucide-react";

function TotalRevenue() {
  const { query, updateQuery, isFiltered, resetDates, apiFormattedDates } =
    useFilterStatCard();

  const { data: adminStatCard } = useQuery({
    queryKey: ["adminStatCard", apiFormattedDates],
    queryFn: () => getDashboardAdminStatCard(apiFormattedDates),
    select: (res) => res.data,
  });

  const { data: adminStatCardV2 } = useQuery({
    queryKey: ["adminStatCardV2"],
    queryFn: () => getDashboardAdminStatCardV2({}),
    select: (res) => res.data,
  });

  return (
    <div className="space-y-4 mt-8">
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
          subTitle={"Cập nhật theo bộ lọc"}
        />

        <StatCardWithButton
          title="Đơn hàng"
          value={`${adminStatCard?.totalOrders || 0}`}
          icon={ShoppingCart}
          color="bg-orange-100 text-orange-900"
          subTitle={"Cập nhật theo bộ lọc"}
        />
        <StatCardWithButton
          title="Đối tác"
          value={`${adminStatCardV2?.totalPartners || 0}`}
          icon={Users}
          color="bg-blue-100 text-blue-900"
        />
        <StatCardWithButton
          title="Cửa hàng"
          value={`${adminStatCardV2?.totalStores || 0}`}
          icon={Store}
          color="bg-red-100 text-red-900"
        />
      </div>
    </div>
  );
}

export default TotalRevenue;
