"use client";

import { Button } from "@/shared/styles/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Edit,
  Mail,
  MapPin,
  Navigation,
  Star,
  Store,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import BarChartExample from "../components/charts/BarChart";
import AreaChartExample from "../components/charts/AreaChart";
import { TargetRevenueChart } from "../components/charts/TargetRevenueChart";
import StoreFeedbackList from "../components/StoreFeebackList";
import MostSellProduct from "../components/MostSellProduct";

type ViewStoreDetailPageProps = {
  params: {
    id: string;
  };
};
export default function ViewStoreDetailPage({
  params,
}: ViewStoreDetailPageProps) {
  const { id } = params;

  const router = useRouter();
  const t = useTranslations("partner.stores.viewStore");
  const tButton = useTranslations("button");
  const tFields = useTranslations("partner.stores.fields");
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
            {t("header")}
          </h1>
        </div>
        {/*Right */}
        <Button
          type="submit"
          form="form-rhf-demo"
          className="btn-primary-gradient"
          onClick={() => router.push(`/admin/stores/${id}/edit`)}
        >
          {tButton("edit")}
          <Edit />
        </Button>
      </div>
      {/*Content */}
      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
          {/* STORE INFO */}
          <div className="bg-background rounded-lg border col-span-1 w-full overflow-hidden shadow-sm">
            {/* Store Image */}
            <div className="relative h-40 w-full">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
                alt="Store image"
                className="h-full w-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Name & Rating */}
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Deer Coffee</h3>

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
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Đang hoạt động
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
                  <p className="leading-snug">
                    123 Đường ABC, Quận 1, TP. Hồ Chí Minh
                  </p>
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
                    <span className="text-xs">
                      nguyenngocthach2301@gmail.com
                    </span>
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

          <div className="bg-background p-4 rounded-lg">
            <MostSellProduct />
          </div>

          <div className="bg-background p-4 rounded-lg">
            <StoreFeedbackList />
          </div>

          <div className="bg-background rounded-lg border col-span-2 w-full overflow-hidden shadow-sm">
            staff list
          </div>
        </div>
      </div>
    </>
  );
}
