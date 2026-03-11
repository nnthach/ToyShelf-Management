"use client";

import { Button } from "@/src/styles/components/ui/button";
import {
  ArrowLeft,
  Box,
  Check,
  Clock,
  Edit,
  Mail,
  MapPin,
  MessageSquare,
  Star,
  Store,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import BarChartExample from "../components/charts/BarChart";
import AreaChartExample from "../components/charts/AreaChart";
import { TargetRevenueChart } from "../components/charts/TargetRevenueChart";
import StoreFeedbackList from "../components/StoreFeebackList";
import MostSellProduct from "../components/MostSellProduct";
import { useQuery } from "@tanstack/react-query";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import { getStoreDetailAPI } from "@/src/services/store.service";
import {
  formatStoreStatusColor,
  formatStoreStatusText,
} from "@/src/utils/formatStatus";
import StatCard from "@/src/components/StatCard";
import EditStoreModal from "./components/EditStoreModal";
import ViewStoreProductSheet from "./components/ViewStoreProductSheet";
import { useAuth } from "@/src/hooks/useAuth";
import { getAllStoreStaffAPI } from "@/src/services/user.service";

export default function PartnerStoreDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();
  const { partner } = useAuth();

  const { data: storeDetail, isLoading} = useQuery({
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
        <StatCard
          title="Doanh thu cửa hàng"
          value="$250,520"
          change="+$30,215"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
        />

        <StatCard
          title="Đơn hàng"
          value="15"
          change="+1,647"
          changePercent="+15%"
          icon={Store}
          color="bg-yellow-100 text-yellow-900"
        />

        <StatCard
          title="Tồn kho"
          value="15"
          change="+2,815"
          changePercent="+18%"
          icon={Box}
          color="bg-blue-100 text-blue-900"
        />
      </div>

      {/*Content */}
      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
          {/* STORE INFO */}
          <div className="bg-background rounded-lg border col-span-1 w-full overflow-hidden shadow-sm">
            {/* Content */}
            <div className="p-5 py-3 space-y-2">
              {/* Name & Rating */}
              <div className="space-y-1">
                <h3 className="text-xl font-bold">{storeDetail?.name}</h3>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium text-foreground">
                      4.8
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    (120 đánh giá)
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full ${formatStoreStatusColor(storeDetail?.isActive)} `}
                  >
                    {formatStoreStatusText(storeDetail?.isActive)}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Info */}
              <div className="space-y-3 text-sm">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <p className="leading-snug">{storeDetail?.storeAddress}</p>
                </div>

                {/* Time */}
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <p>Mon – Sun: 08:00 – 22:00</p>
                </div>
              </div>

              {/*Owner */}
              <div className="rounded-md border bg-muted/40 p-2 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>Owner: Nguyen Ngoc Thach</span>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs">{storeDetail?.partnerId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*chart */}
          <div className="bg-background rounded-lg col-span-3 h-[60vh] w-full">
            <AreaChartExample />
          </div>
          {/*Chart total revenue */}
          <div className="bg-background rounded-lg col-span-3 h-[60vh] w-full">
            <BarChartExample />
          </div>
          {/*Chart target value */}
          <div className="bg-background rounded-lg col-span-1 w-full">
            <TargetRevenueChart />
          </div>

          <div className="bg-background p-4 rounded-lg h-[50vh]">
            <MostSellProduct />
          </div>

          <div className="bg-background p-4 rounded-lg h-[50vh]">
            <StoreFeedbackList />
          </div>
        </div>
      </div>
    </>
  );
}
