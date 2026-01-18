"use client";

import StatCard from "@/shared/components/StatCard";
import { StoreFakeData } from "@/shared/constants/fakeData";
import {
  ArrowLeft,
  Box,
  ClipboardList,
  Clock,
  Edit,
  Eye,
  Mail,
  MapPin,
  Server,
  Star,
  Store,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import AreaChartExample from "./components/charts/AreaChart";
import BarChartExample from "./components/charts/BarChart";
import { TargetRevenueChart } from "./components/charts/TargetRevenueChart";
import MostSellProduct from "./components/MostSellProduct";
import StoreFeedbackList from "./components/StoreFeebackList";
import { Button } from "@/shared/styles/components/ui/button";
import ViewPartnerSheet from "./components/ViewPartnerSheet";

export default function ViewPartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslations("admin.partners.viewPartner");
  const tButton = useTranslations("button");

  return (
    <>
      {/*Header */}
      <div className="flex items-center justify-between mb-6">
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
            {t("header")}
          </h1>
        </div>
      </div>

      {/*Statistic card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          title="Revenue"
          value="$250,520"
          change="+$30,215"
          changePercent="+12%"
          icon={Box}
          color="bg-green-100 text-green-900"
        />

        <StatCard
          title="Stores"
          value="10,980"
          change="+1,647"
          changePercent="+15%"
          icon={Store}
          color="bg-yellow-100 text-yellow-900"
        />

        <StatCard
          title="Cabinets"
          value="15,640"
          change="+2,815"
          changePercent="+18%"
          icon={Server}
          color="bg-pink-100 text-pink-900"
        />

        <StatCard
          title="Products"
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
          {/* PARTNER INFO */}
          <div className="bg-background border rounded-xl shadow-sm">
            {/* PARTNER BANK CARD */}
            <div className="relative rounded-xl overflow-hidden shadow-md">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600" />

              {/* Content */}
              <div className="relative p-6 text-white space-y-6">
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold tracking-wide">
                      Nguyễn Ngọc Thạch
                    </h3>
                    <p className="text-sm text-gray-300">
                      nguyenthach@gmail.com
                    </p>
                  </div>

                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-400/30">
                    Active
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Partner Level</p>
                    <p className="font-semibold text-yellow-400">Gold</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Joined At</p>
                    <p className="font-medium">Jan 12, 2024</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Total Stores</p>
                    <p className="font-medium">3</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Total Revenue</p>
                    <p className="font-semibold tracking-wide">£230,000</p>
                  </div>
                </div>

                {/* Action */}
                <ViewPartnerSheet>
                  <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                    View Transactions
                  </Button>
                </ViewPartnerSheet>
              </div>
            </div>
          </div>

          <div className="bg-background p-4 rounded-lg shadow-sm">
            <MostSellProduct />
          </div>

          <div className="bg-background rounded-lg border col-span-2 w-full overflow-hidden shadow-sm">
            staff list
          </div>
          {/*Chart total revenue */}
          <div className="bg-background rounded-lg col-span-3 h-[60vh] w-full">
            <BarChartExample />
          </div>
          {/*Chart target value */}
          <div className="bg-background rounded-lg col-span-1 w-full">
            <TargetRevenueChart />
          </div>
        </div>
      </div>

      {/*Store */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4 mb-6">
        {StoreFakeData.slice(0, 3).map((store) => {
          const image = store.images?.[0];

          return (
            <div
              key={store.id}
              className="group rounded-xl border border-gray-200 bg-white p-4
                     hover:shadow-lg transition-shadow duration-200"
            >
              {/* Image */}
              <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-2">
                <div className="aspect-square">
                  {image && (
                    <img
                      src={image}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Eye button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 z-20
                     opacity-0 group-hover:opacity-100 transition"
                  onClick={() => router.push(`/admin/stores/${store.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>

                {/* Hover info */}
                <div
                  className="absolute inset-x-0 bottom-0 z-10
                         translate-y-full opacity-0
                         group-hover:translate-y-0 group-hover:opacity-100
                         transition-all duration-300 ease-out"
                >
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Open day</span>
                      <span className="font-medium text-gray-900">
                        {store.openDay}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Open time</span>
                      <span className="font-medium text-gray-900">
                        {store.openTime} - {store.closeTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Address</span>
                      <span className="font-medium text-gray-900 truncate">
                        {store.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mb-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full
                             bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                  {store?.status}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                {store?.name}
              </h3>
            </div>
          );
        })}
      </div>
    </>
  );
}
