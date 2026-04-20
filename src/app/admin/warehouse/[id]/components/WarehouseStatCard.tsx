import StatCardWithButton from "@/src/components/StatCardWithButton";
import { getDashboardWarehouseStatCard } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { Box, PackageCheck, Server, ShoppingCart } from "lucide-react";
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
        title="Đơn giao hàng"
        value={warehouseStatCard?.totalOrders}
        icon={PackageCheck}
        color="bg-green-100 text-green-900"
      />
      <StatCardWithButton
        title="Hàng Tồn kho"
        value={warehouseStatCard?.totalInventory}
        icon={Box}
        color="bg-blue-100 text-blue-900"
      />
      <StatCardWithButton
        title="Kệ Tồn Kho"
        value={warehouseStatCard?.totalShelves}
        icon={Server}
        color="bg-purple-100 text-purple-900"
      />
    </>
  );
}

export default memo(WarehouseStatCard);
