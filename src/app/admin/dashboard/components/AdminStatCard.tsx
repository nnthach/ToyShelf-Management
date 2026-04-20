"use client";

import StatCardWithButton from "@/src/components/StatCardWithButton";
import { getDashboardAdminStatCard } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart, Store, Users } from "lucide-react";
import { useRouter } from "next/navigation";

function AdminStatCard() {
  const router = useRouter();

  const {
    data: adminStatCard,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminStatCard"],
    queryFn: () => getDashboardAdminStatCard({}),
    select: (res) => res.data,
  });

  return (
    <>
      <StatCardWithButton
        title="Doanh thu"
        value={`${(adminStatCard?.totalRevenue ?? 0).toLocaleString() || 0} VND`}
        icon={DollarSign}
        color="bg-green-100 text-green-900"
      />

      <StatCardWithButton
        title="Đơn hàng"
        value={`${adminStatCard?.totalOrders || 0}`}
        icon={ShoppingCart}
        color="bg-orange-100 text-orange-900"
        action={() => router.push(`/admin/orders`)}
      />
      <StatCardWithButton
        title="Đối tác"
        value={`${adminStatCard?.totalPartners || 0}`}
        icon={Users}
        color="bg-blue-100 text-blue-900"
        action={() => router.push(`/admin/partners`)}
      />
      <StatCardWithButton
        title="Cửa hàng"
        value={`${adminStatCard?.totalStores || 0}`}
        icon={Store}
        color="bg-purple-100 text-purple-900"
        action={() => router.push(`/admin/stores`)}
      />
    </>
  );
}

export default AdminStatCard;
