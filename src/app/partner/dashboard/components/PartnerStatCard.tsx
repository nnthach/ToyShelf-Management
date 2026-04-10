import StatCardWithButton from "@/src/components/StatCardWithButton";
import { useAuth } from "@/src/hooks/useAuth";
import { getDashboardPartnerStatCard } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Box, DollarSign, Server, ShoppingCart, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

function PartnerStatCard() {
  const router = useRouter();
  const { partner } = useAuth();

  const partnerId = partner?.partnerId;

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
        value={`${(partnerStatCard?.revenue ?? 0).toLocaleString() || 0} VND`}
        change="+30,215 VND"
        changePercent="+12%"
        icon={DollarSign}
        color="bg-green-100 text-green-900"
      />

      <StatCardWithButton
        title="Hoa hồng"
        value={`${(partnerStatCard?.commission ?? 0).toLocaleString() || 0} VND`}
        change="+2,815"
        changePercent="+18%"
        icon={Box}
        color="bg-blue-100 text-blue-900"
        action={() => router.push(`/partner/stores?companyid=${partnerId}`)}
      />
      <StatCardWithButton
        title="Đơn hàng"
        value={`${partnerStatCard?.orders || 0}`}
        change="+2,815"
        changePercent="+18%"
        icon={ShoppingCart}
        color="bg-pink-100 text-pink-900"
        action={() => router.push(`/partner/orders`)}
      />

      <StatCardWithButton
        title="Cửa hàng"
        value={`${partnerStatCard?.stores || 0}`}
        change="+1,647"
        changePercent="+15%"
        icon={Store}
        color="bg-yellow-100 text-yellow-900"
        action={() => router.push(`/partner/stores?companyid=${partnerId}`)}
      />
    </>
  );
}

export default memo(PartnerStatCard);
