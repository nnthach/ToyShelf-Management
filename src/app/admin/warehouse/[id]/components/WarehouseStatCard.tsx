import StatCardWithButton from "@/src/components/StatCardWithButton";
import { getDashboardWarehouseStatCard } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Box, Server } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

function WarehouseStatCard({ warehouseId }: { warehouseId: string }) {
  const router = useRouter();

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
        icon={Box}
        color="bg-green-100 text-green-900"
      />
      <StatCardWithButton
        title="Hàng Tồn kho"
        value={warehouseStatCard?.totalInventory}
        change="+20"
        changePercent="+18%"
        icon={Box}
        color="bg-blue-100 text-blue-900"
        action={() => router.push(`/admin/warehouse/${warehouseId}/inventory`)}
      />
      <StatCardWithButton
        title="Kệ Tồn Kho"
        value={warehouseStatCard?.totalShelves}
        change="+2"
        changePercent="+18%"
        icon={Server}
        color="bg-pink-100 text-pink-900"
      />
    </>
  );
}

export default memo(WarehouseStatCard);
