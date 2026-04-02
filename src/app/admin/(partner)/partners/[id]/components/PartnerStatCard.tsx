import StatCardWithButton from "@/src/components/StatCardWithButton";
import { getDashboardPartnerStatCard } from "@/src/services/dashboard.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Box, Server, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

function PartnerStatCard({ partnerId }: { partnerId: string }) {
  const router = useRouter();

  const {
    data: partnerStatCard,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["partnerStatCard", partnerId],
    queryFn: () => getDashboardPartnerStatCard({}, partnerId!),
    select: (res) => res.data,
    enabled: !!partnerId,
  });

  console.log("partnerStatCard", partnerStatCard);

  return (
    <>
      <StatCardWithButton
        title="Doanh thu"
        value={`${(partnerStatCard?.revenue ?? 0).toLocaleString()} VND`}
        change="+30,215 VND"
        changePercent="+12%"
        icon={Box}
        color="bg-green-100 text-green-900"
      />

      <StatCardWithButton
        title="Hoa hồng"
        value={`${(partnerStatCard?.commission ?? 0).toLocaleString()} VND`}
        change="+2,815"
        changePercent="+18%"
        icon={Box}
        color="bg-blue-100 text-blue-900"
        action={() => router.push(`/admin/stores?companyid=${partnerId}`)}
      />
      <StatCardWithButton
        title="Đơn hàng"
        value={`${partnerStatCard?.orders}`}
        change="+2,815"
        changePercent="+18%"
        icon={Server}
        color="bg-pink-100 text-pink-900"
      />

      <StatCardWithButton
        title="Cửa hàng"
        value={`${partnerStatCard?.stores}`}
        change="+1,647"
        changePercent="+15%"
        icon={Store}
        color="bg-yellow-100 text-yellow-900"
        action={() => router.push(`/admin/stores?companyid=${partnerId}`)}
      />
    </>
  );
}

export default memo(PartnerStatCard);
