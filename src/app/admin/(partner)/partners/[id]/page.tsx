"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/src/styles/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getPartnerDetailAPI } from "@/src/services/partner.service";
import TotalRevenueChart from "./components/charts/TotalRevenueChart";
import PartnerStatCard from "./components/PartnerStatCard";
import TotalOrderChart from "./components/charts/TotalOrderChart";
import PartnerBannerInfo from "./components/PartnerBannerInfo";
import TopThreeStore from "./components/TopThreeStore";
import TopThreeProduct from "./components/TopThreeProduct";
import StoreMap from "./components/StoreMap";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";

export default function ViewPartnerDetailPage() {
  const { id: partnerId } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: partnerDetail, isLoading } = useQuery({
    queryKey: ["partner", partnerId],
    queryFn: () => getPartnerDetailAPI(partnerId!),
    select: (res) => res.data,
    enabled: !!partnerId,
  });

  if (isLoading) {
    return <LoadingPageComponent />;
  }

  return (
    <div className="space-y-4 mb-4">
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
            Chi tiết thông tin đối tác
          </h1>
        </div>
      </div>

      {/* THÔNG TIN ĐỐI TÁC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PartnerBannerInfo partnerDetail={partnerDetail} />
      </div>

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PartnerStatCard partnerId={partnerId} />
      </div>

      {/*Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        {/*Chart total revenue */}
        <div className="bg-background rounded-lg col-span-1 md:col-span-2 2xl:col-span-4 min-h-[500px] p-4 border border-gray-100 shadow-sm">
          <TotalRevenueChart />
        </div>
        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-2 2xl:col-span-3 min-h-[450px] shadow-sm border border-gray-100">
          <TotalOrderChart />
        </div>
        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-2 2xl:col-span-1 shadow-sm border border-gray-100">
          <TopThreeStore />
        </div>

        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-1 2xl:col-span-1 shadow-sm border border-gray-100">
          <TopThreeProduct />
        </div>

        <div className="bg-background p-4 rounded-lg col-span-1 md:col-span-1 2xl:col-span-1 shadow-sm border border-gray-100">
          <h1>Dashboard</h1>
        </div>
        <div className="bg-background rounded-lg col-span-1 md:col-span-2 2xl:col-span-2 p-2 min-h-[50vh] w-full border border-gray-100 shadow-sm">
          <StoreMap partnerId={partnerId} />
        </div>
      </div>
    </div>
  );
}
