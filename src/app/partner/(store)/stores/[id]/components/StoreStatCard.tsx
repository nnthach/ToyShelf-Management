import FilterStatCard from "@/src/components/FilterStatCard";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import { useFilterStatCard } from "@/src/hooks/useFilterStatCard";
import { getDashboardStoreStatCard } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

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

  return (
    <div>
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
        />

        <StatCardWithButton
          title="Đơn hàng"
          value={`${storeStatCard?.totalOrders}`}
          icon={ShoppingCart}
          color="bg-orange-100 text-orange-900"
          action={() => router.push(`/partner/orders?storeId=${storeId}`)}
        />
      </div>
    </div>
  );
}

export default StoreStatCard;
