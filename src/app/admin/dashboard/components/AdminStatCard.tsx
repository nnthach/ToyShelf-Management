"use client";

import StatCardWithButton from "@/src/components/StatCardWithButton";
import {
  Box,
  ClipboardList,
  DollarSign,
  ShoppingCart,
  Star,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

function AdminStatCard() {
  const router = useRouter();
  return (
    <>
      <StatCardWithButton
        title="Doanh thu"
        value="250,520 VND"
        change="+30,215 VND"
        changePercent="+12%"
        icon={DollarSign}
        color="bg-green-100 text-green-900"
      />

      <StatCardWithButton
        title="Đơn hàng"
        value="200"
        change="+25"
        changePercent="+15%"
        icon={ShoppingCart}
        color="bg-yellow-100 text-yellow-900"
        action={() => router.push(`/admin/orders`)}
      />
      <StatCardWithButton
        title="Đối tác"
        value="53"
        change="+2"
        changePercent="+18%"
        icon={Users}
        color="bg-blue-100 text-blue-900"
        action={() => router.push(`/admin/partners`)}
      />
      <StatCardWithButton
        title="Cửa hàng"
        value="230"
        change="+2,815"
        changePercent="+18%"
        icon={Store}
        color="bg-pink-100 text-pink-900"
        action={() => router.push(`/admin/stores`)}
      />
    </>
  );
}

export default AdminStatCard;
