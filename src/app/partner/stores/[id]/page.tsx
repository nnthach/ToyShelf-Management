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
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import BarChartExample from "../components/charts/BarChart";
import AreaChartExample from "../components/charts/AreaChart";
import { TargetRevenueChart } from "../components/charts/TargetRevenueChart";
import StoreFeedbackList from "../components/StoreFeebackList";
import MostSellProduct from "../components/MostSellProduct";
import { StaffFakeData } from "@/src/constants/fakeData";
import ViewEverydayReportSheet from "./components/ViewEverydayReportSheet";
import ViewStoreProductSheet from "./components/ViewStoreProductSheet";
import ViewStoreFeedbackSheet from "./components/ViewStoreFeedbackSheet";
import ViewStoreStaffSheet from "./components/ViewStoreStaffSheet";
import { useQuery } from "@tanstack/react-query";
import LoadingPageComponent from "@/src/components/LoadingPageComponent";
import { getStoreDetailAPI } from "@/src/services/store.service";
import { formatStoreStatusColor, formatStoreStatusText } from "@/src/utils/formatStatus";


interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => {
  const [bgColor, textColor] = color.split(" ");

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl p-4 bg-white shadow-md border border-transparent hover:shadow-md transition-all duration-200`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-base font-medium mb-2 text-gray-400">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>

        <div
          className={`p-2 rounded-xl ${bgColor} backdrop-blur-sm flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
      </div>
    </div>
  );
};

export default function ViewStoreDetailPage() {
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
          <ViewStoreStaffSheet>
            <Button
              className="
      bg-blue-500 text-white
      dark:bg-blue-900 dark:text-blue-100
      hover:bg-blue-600 dark:hover:bg-blue-800
    "
            >
              <User className="h-4 w-4" />
              Danh sách nhân viên
            </Button>
          </ViewStoreStaffSheet>
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

          <ViewStoreFeedbackSheet>
            <Button
              className="
      bg-amber-500 text-white
      dark:bg-amber-900 dark:text-amber-100
      hover:bg-amber-600 dark:hover:bg-amber-800
    "
            >
              <MessageSquare className="h-4 w-4" />
              Danh sách đánh giá
            </Button>
          </ViewStoreFeedbackSheet>

          <Button
            className="btn-primary-gradient"
            onClick={() => router.push(`/admin/stores/${id}/edit`)}
          >
            <Check className="h-4 w-4" />
            Chỉnh sửa
          </Button>

          <Button
            className="btn-primary-gradient"
            onClick={() => router.push(`/admin/stores/${id}/edit`)}
          >
            <Check className="h-4 w-4" />
            Vô hiệu hóa
          </Button>

          <Button
            className="btn-primary-gradient"
            onClick={() => router.push(`/admin/stores/${id}/edit`)}
          >
            <Check className="h-4 w-4" />
            Phục hồi
          </Button>
        </div>
      </div>

      {/*Stat card */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4">
        <StatCard
          title={`Tổng sản phẩm`}
          value={250}
          icon={Box}
          color="bg-green-200 text-green-900"
        />
        <StatCard
          title={`Đánh giá`}
          value={4.8}
          icon={Star}
          color="bg-pink-200 text-pink-900"
        />
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

          <div className="bg-background rounded-lg border col-span-2 w-full overflow-hidden shadow-sm">
            {/* List */}
            <div className="overflow-x-auto border">
              <table className="w-full text-sm">
                {/* Header */}
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3 font-medium">Full Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y">
                  {StaffFakeData.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50 transition">
                      {/* Full name */}
                      <td className="px-4 py-3 font-medium">
                        {staff.fullName}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 text-gray-500">{staff.email}</td>

                      {/* Role */}
                      <td className="px-4 py-3">{staff.role}</td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-md ${
                            staff.status === "active"
                              ? "bg-green-100 text-green-700"
                              : staff.status === "inactive"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {staff.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/*diver */}
            <div className="h-px bg-gray-200 my-3" />
            {/*Footer */}
            <div className="flex justify-end">
              <ViewEverydayReportSheet>
                <Button>Các báo cáo hàng ngày</Button>
              </ViewEverydayReportSheet>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
