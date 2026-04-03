import StatCardWithButton from "@/src/components/StatCardWithButton";
import { useAuth } from "@/src/hooks/useAuth";
import { getDashboardStoreStatCard } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Box, Store } from "lucide-react";
import { useRouter } from "next/navigation";

function StoreStatCard({
  storeId,
  inventoryLocationId,
}: {
  storeId: string;
  inventoryLocationId: string;
}) {
  const router = useRouter();
  const { partner } = useAuth();

  const { data: storeStatCard } = useQuery({
    queryKey: ["storeStatCard", storeId],
    queryFn: () => getDashboardStoreStatCard({}, storeId),
    select: (res) => res.data,
    enabled: !!storeId,
  });

  return (
    <>
      <StatCardWithButton
        title="Doanh thu cửa hàng"
        value={`${(storeStatCard?.totalRevenue ?? 0).toLocaleString()} VND`}
        change="+$30,215"
        changePercent="+12%"
        icon={Box}
        color="bg-green-100 text-green-900"
      />

      <StatCardWithButton
        title="Đơn hàng"
        value={`${storeStatCard?.totalOrders}`}
        change="+1,647"
        changePercent="+15%"
        icon={Store}
        color="bg-yellow-100 text-yellow-900"
        action={() =>
          router.push(
            `/partner/orders?partnerId=${partner?.id}&storeId=${storeId}`,
          )
        }
      />

      <StatCardWithButton
        title="Tồn kho"
        value="15"
        change="+2,815"
        changePercent="+18%"
        icon={Box}
        color="bg-blue-100 text-blue-900"
        action={() =>
          router.push(`/partner/inventories?locationId=${inventoryLocationId}`)
        }
      />
      <StatCardWithButton
        title="Kệ"
        value="15"
        change="+2,815"
        changePercent="+18%"
        icon={Box}
        color="bg-pink-100 text-pink-900"
        action={() =>
          router.push(
            `/admin/stores/${storeId}/inventory?inventoryLocationId=${inventoryLocationId}`,
          )
        }
      />
    </>
  );
}

export default StoreStatCard;
