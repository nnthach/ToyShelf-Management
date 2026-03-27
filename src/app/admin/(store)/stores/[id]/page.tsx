"use client";

import { Button } from "@/src/styles/components/ui/button";
import {
  ArrowLeft,
  Box,
  Clock,
  Mail,
  MapPin,
  Star,
  Store,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import BarChartExample from "../components/charts/BarChart";
import AreaChartExample from "../components/charts/AreaChart";
import { TargetRevenueChart } from "../components/charts/TargetRevenueChart";
import { useQuery } from "@tanstack/react-query";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import { getStoreDetailAPI } from "@/src/services/store.service";
import {
  formatStoreStatusColor,
  formatStoreStatusText,
} from "@/src/utils/formatStatus";
import EditStoreModal from "./components/EditStoreModal";
import ViewStoreProductSheet from "./components/ViewStoreProductSheet";
import { getAllStoreStaffAPI } from "@/src/services/user.service";
import StatCardWithButton from "@/src/components/StatCardWithButton";

export default function PartnerStoreDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();

  const { data: storeDetail, isLoading } = useQuery({
    queryKey: ["store", id],
    queryFn: () => getStoreDetailAPI(id!),
    select: (res) => res.data,
    enabled: !!id,
  });

  const { data: storeStaffList } = useQuery({
    queryKey: ["storeStaffs", { partnerId: storeDetail?.partnerId }],
    queryFn: () =>
      getAllStoreStaffAPI({ partnerId: storeDetail?.partnerId, storeId: id }),
    select: (res) => res.data,
  });

  if (!id) return null;

  if (isLoading) {
    return <LoadingPageComponent />;
  }

  return (
    <>
      {/*Header */}
      <div className="flex items-center justify-between">
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
            Thông tin cửa hàng
          </h1>
        </div>
        {/*Right */}
        <div className="flex items-center gap-3">
          <ViewStoreProductSheet>
            <Button
              className="
      bg-green-500 text-white
      dark:bg-green-900 dark:text-green-100
      hover:bg-green-600 dark:hover:bg-green-800
    "
            >
              <Box className="h-4 w-4" />
              Danh sách sản phẩm
            </Button>
          </ViewStoreProductSheet>

          <EditStoreModal storeId={id} />
        </div>
      </div>

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
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
        />

        <StatCardWithButton
          title="Tồn kho"
          value="15"
          change="+2,815"
          changePercent="+18%"
          icon={Box}
          color="bg-blue-100 text-blue-900"
          action={
            <Button
              onClick={() =>
                router.push(
                  `/admin/stores/${id}/inventory?inventoryLocationId=${storeDetail.inventoryLocationId}`,
                )
              }
            >
              Chi tiết
            </Button>
          }
        />
      </div>

      {/*Content */}
      <div className="mt-6">
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
        </div>
      </div>
    </>
  );
}
