"use client";

import { Button } from "@/src/styles/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import { getStoreDetailAPI } from "@/src/services/store.service";
import StoreBannerInfo from "./components/StoreBannerInfo";
import TotalRevenueChart from "./components/charts/TotalRevenueChart";
import TotalOrderChart from "./components/charts/TotalOrderChart";
import TopThreeProduct from "./components/charts/TopThreeProduct";
import StoreStatCard from "./components/StoreStatCard";

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

  if (!id) return null;

  if (isLoading) {
    return <LoadingPageComponent />;
  }

  return (
    <div className="space-y-4 mb-4">
      {/*Header */}
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
          Thông tin cửa hàng {storeDetail?.name}
        </h1>
      </div>

      {/*banner store ìno */}
      <StoreBannerInfo storeDetail={storeDetail} />

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StoreStatCard
          storeId={id}
          inventoryLocationId={storeDetail?.inventoryLocationId}
        />
      </div>

      {/*Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 ">
        <div className="bg-background rounded-lg lg:col-span-4 min-h-[70vh] p-4 border border-gray-100 shadow-sm">
          <TotalRevenueChart />
        </div>

        <div className="bg-background p-4 rounded-lg lg:col-span-3 min-h-[60vh] shadow-sm border border-gray-100">
          <TotalOrderChart />
        </div>
        <div className="bg-background p-4 rounded-lg shadow-sm border border-gray-100">
          <TopThreeProduct />
        </div>
      </div>
    </div>
  );
}
