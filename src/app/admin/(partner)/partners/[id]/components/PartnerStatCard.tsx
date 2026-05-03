import FilterStatCard from "@/src/components/FilterStatCard";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import { useFilterStatCard } from "@/src/hooks/useFilterStatCard";
import {
  getDashboardPartnerStatCard,
  getDashboardPartnerStatCardV2,
} from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Box, DollarSign, ShoppingCart, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

function PartnerStatCard({ partnerId }: { partnerId: string }) {
  const router = useRouter();

  const { query, updateQuery, isFiltered, resetDates, apiFormattedDates } =
    useFilterStatCard();

  const { data: partnerStatCard } = useQuery({
    queryKey: ["partnerStatCard", partnerId, apiFormattedDates],
    queryFn: () => getDashboardPartnerStatCard(apiFormattedDates, partnerId!),
    select: (res) => res.data,
    enabled: !!partnerId,
  });

  const { data: partnerStatCardV2 } = useQuery({
    queryKey: ["partnerStatCardV2", partnerId],
    queryFn: () => getDashboardPartnerStatCardV2(partnerId),
    select: (res) => res.data,
    enabled: !!partnerId,
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
          value={`${(partnerStatCard?.revenue ?? 0).toLocaleString()} VND`}
          icon={DollarSign}
          color="bg-green-100 text-green-900"
          subTitle="Cập nhật theo bộ lọc"
        />

        <StatCardWithButton
          title="Hoa hồng"
          value={`${(partnerStatCard?.commission ?? 0).toLocaleString()} VND`}
          icon={Box}
          color="bg-blue-100 text-blue-900"
          action={() =>
            router.push(`/admin/monthly-settlement?partnerId=${partnerId}`)
          }
          subTitle="Cập nhật theo bộ lọc"
        />
        <StatCardWithButton
          title="Đơn hàng"
          value={`${partnerStatCard?.orders || 0}`}
          icon={ShoppingCart}
          color="bg-purple-100 text-purple-900"
          action={() => router.push(`/admin/orders?partnerId=${partnerId}`)}
          subTitle="Cập nhật theo bộ lọc"
        />

        <StatCardWithButton
          title="Cửa hàng"
          value={`${partnerStatCardV2?.totalStores || 0}`}
          icon={Store}
          color="bg-orange-100 text-orange-900"
          action={() => router.push(`/admin/stores?companyid=${partnerId}`)}
        />
      </div>
    </div>
  );
}

export default memo(PartnerStatCard);
