import StatCardWithButton from "@/src/components/StatCardWithButton";
import { getDashboardPartnerStatCard } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Box, DollarSign, ShoppingCart, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

function PartnerStatCard({ partnerId }: { partnerId: string }) {
  const router = useRouter();

  const { data: partnerStatCard } = useQuery({
    queryKey: ["partnerStatCard", partnerId],
    queryFn: () => getDashboardPartnerStatCard({}, partnerId!),
    select: (res) => res.data,
    enabled: !!partnerId,
  });

  return (
    <>
      <StatCardWithButton
        title="Doanh thu"
        value={`${(partnerStatCard?.revenue ?? 0).toLocaleString()} VND`}
        icon={DollarSign}
        color="bg-green-100 text-green-900"
      />

      <StatCardWithButton
        title="Hoa hồng"
        value={`${(partnerStatCard?.commission ?? 0).toLocaleString()} VND`}
        icon={Box}
        color="bg-blue-100 text-blue-900"
        action={() =>
          router.push(`/admin/monthly-settlement?partnerId=${partnerId}`)
        }
      />
      <StatCardWithButton
        title="Đơn hàng"
        value={`${partnerStatCard?.orders}`}
        icon={ShoppingCart}
        color="bg-purple-100 text-purple-900"
        action={() => router.push(`/admin/orders?partnerId=${partnerId}`)}
      />

      <StatCardWithButton
        title="Cửa hàng"
        value={`${partnerStatCard?.stores}`}
        icon={Store}
        color="bg-orange-100 text-orange-900"
        action={() => router.push(`/admin/stores?companyid=${partnerId}`)}
      />
    </>
  );
}

export default memo(PartnerStatCard);
