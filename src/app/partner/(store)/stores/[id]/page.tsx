"use client";

import { Button } from "@/src/styles/components/ui/button";
import { ArrowLeft, ArrowRight, Box, Store } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import BarChartExample from "../components/charts/BarChart";
import AreaChartExample from "../components/charts/AreaChart";
import { TargetRevenueChart } from "../components/charts/TargetRevenueChart";
import MostSellProduct from "../components/MostSellProduct";
import { useQuery } from "@tanstack/react-query";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import { getStoreDetailAPI } from "@/src/services/store.service";
import { useAuth } from "@/src/hooks/useAuth";
import { getAllStoreStaffAPI } from "@/src/services/user.service";
import StatCardWithButton from "@/src/components/StatCardWithButton";
import StoreBannerInfo from "./components/StoreBannerInfo";

export default function PartnerStoreDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();
  const { partner } = useAuth();

  const { data: storeDetail, isLoading } = useQuery({
    queryKey: ["store", id],
    queryFn: () => getStoreDetailAPI(id!),
    select: (res) => res.data,
    enabled: !!id,
  });

  const { data: storeStaffList } = useQuery({
    queryKey: ["storeStaffs", { partnerId: partner?.partnerId }],
    queryFn: () =>
      getAllStoreStaffAPI({ partnerId: partner?.partnerId, storeId: id }),
    select: (res) => res.data,
    enabled: !!id && !!partner?.partnerId,
  });

  if (!id) return null;

  if (isLoading) {
    return <LoadingPageComponent />;
  }

  return (
    <div className="space-y-6">
      {/*Left */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size={"sm"}
          onClick={() => router.back()}
          className="w-8 h-8"
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold dark:text-foreground">
          Thông tin cửa hàng {storeDetail.name}
        </h1>
      </div>

      {/*Store info & store staff */}
      <StoreBannerInfo storeDetail={storeDetail} />

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardWithButton
          title="Doanh thu cửa hàng"
          value="$250,520"
          change="+$30,215"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
        />

        <StatCardWithButton
          title="Đơn hàng"
          value="15"
          change="+1,647"
          changePercent="+15%"
          icon={Store}
          color="bg-yellow-100 text-yellow-900"
          action={() =>
            router.push(
              `/partner/orders?partnerId=${partner?.id}&storeId=${id}`,
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
            router.push(
              `/partner/inventories?locationId=${storeDetail.inventoryLocationId}`,
            )
          }
        />
      </div>

      {/*Content */}
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
          {/*Chart total revenue */}
          <div className="bg-background rounded-lg col-span-3 h-[60vh] w-full">
            <BarChartExample />
          </div>
          {/*Chart target value */}
          <div className="bg-background rounded-lg col-span-1 w-full">
            <TargetRevenueChart />
          </div>

          {/*chart */}
          <div className="bg-background rounded-lg col-span-4 h-[60vh] w-full">
            <AreaChartExample />
          </div>

          <div className="bg-background p-4 rounded-lg h-[50vh]">
            <MostSellProduct />
          </div>
        </div>
      </div>
    </div>
  );
}
