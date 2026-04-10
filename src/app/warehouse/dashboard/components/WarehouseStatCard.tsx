import StatCardWithButton from "@/src/components/StatCardWithButton";
import { useAuth } from "@/src/hooks/useAuth";
import { getDashboardWarehouseStatCard } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Box, Server, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

function WarehouseStatCard() {
  const router = useRouter();

  const { warehouse } = useAuth();
  const warehouseId = warehouse?.warehouseId;

  const { data: warehouseStatCard } = useQuery({
    queryKey: ["warehouseStatCard", warehouseId],
    queryFn: () => getDashboardWarehouseStatCard({}, warehouseId!),
    select: (res) => res.data,
    enabled: !!warehouseId,
  });

  return (
    <>
      <StatCardWithButton
        title="Đơn hàng"
        value={warehouseStatCard?.totalOrders}
        change="+10"
        changePercent="+12%"
        icon={ShoppingCart}
        color="bg-green-100 text-green-900"
        action={() => router.push(`/warehouse/refill-stocks`)}
      />
      <StatCardWithButton
        title="Hàng Tồn kho"
        value={warehouseStatCard?.totalInventory}
        change="+20"
        changePercent="+18%"
        icon={Box}
        color="bg-blue-100 text-blue-900"
        action={() => router.push(`/warehouse/inventory`)}
      />
      <StatCardWithButton
        title="Kệ Tồn Kho"
        value={warehouseStatCard?.totalShelves}
        change="+2"
        changePercent="+18%"
        icon={Server}
        color="bg-pink-100 text-pink-900"
        action={() => router.push(`/warehouse/shelf-inventory`)}
      />
    </>
  );
}

export default memo(WarehouseStatCard);
