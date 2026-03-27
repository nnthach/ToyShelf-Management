"use client";

import { Button } from "@/src/styles/components/ui/button";
import {
  ArrowLeft,
  Box,
  Building,
  Check,
  Clock,
  Edit,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Sparkles,
  Star,
  Store,
  Target,
  User,
  UserCircle,
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
import StatCardWithButton from "@/src/components/StatCardWithButton";
import { StoreStaff } from "@/src/types";
import { formatStoreRoleToVN } from "@/src/utils/format";

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
    <>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {/* A. LEFT: Store Info - Compact Deep Gradient Section */}
        <div className="col-span-1 md:col-span-3">
          <div className="relative group p-5 rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 shadow-xl overflow-hidden transition-all border border-white/5">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('/bg-patterns/abstract-01.png')] bg-cover" />
            <Sparkles className="absolute -top-4 -right-4 h-24 w-24 text-blue-400 opacity-10 rotate-12" />

            <div className="flex justify-between items-center mb-2 relative z-10">
              <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-blue-200/80">
                <Building size={16} /> Chi tiết cửa hàng
              </h2>
              <Button
                size="icon"
                variant="secondary"
                className="h-7 w-7 bg-white/5 hover:bg-white/10 text-white/70 rounded-full border border-white/10"
              >
                <Pencil size={12} />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 relative z-10">
              <InfoItem
                icon={Building}
                label="Đối tác"
                value={storeDetail?.partnerName}
              />
              <InfoItem
                icon={UserCircle}
                label="Chủ sở hữu"
                value={storeDetail?.ownerName}
              />
              <InfoItem
                icon={Phone}
                label="Số điện thoại"
                value={storeDetail?.phoneNumber}
                isMonospace
              />
              <InfoItem
                icon={MapPin}
                label="Khu vực"
                value={storeDetail?.cityName}
              />

              <div className="col-span-1 sm:col-span-2 flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all mt-1">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Địa chỉ chi tiết
                  </p>
                  <p className="text-sm font-medium text-slate-200">
                    {storeDetail?.storeAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* B. RIGHT: Store Staff - Compact Section */}
        <div className="col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-3 h-full flex flex-col gap-3 border border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3 mb-1 text-slate-500 uppercase tracking-tighter">
              <Target size={14} className="text-amber-500" /> Nhân viên (
              {storeStaffList?.length || 0})
            </h2>

            <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[180px] custom-scrollbar">
              {storeStaffList?.map((staff: StoreStaff) => (
                <div
                  key={staff.userId}
                  className="flex items-center gap-2.5 p-2 rounded-lg border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600">
                      {staff.fullName}
                    </p>
                    <p className="text-[12px] text-slate-600 truncate">
                      {staff.email}
                    </p>
                  </div>

                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      staff.storeRole === "Manager"
                        ? "bg-amber-100/50 text-amber-700 border border-amber-200/50"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {formatStoreRoleToVN(staff.storeRole)}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
                  `/partner/stores/${id}/inventory?inventoryLocationId=${storeDetail.inventoryLocationId}`,
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

          <div className="bg-background p-4 rounded-lg h-[50vh]">
            <MostSellProduct />
          </div>
        </div>
      </div>
    </>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  isMonospace,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  isMonospace?: boolean;
}) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-xl hover:bg-white/10 transition-colors">
      <Icon className="h-5 w-5 text-blue-100 mt-1 shrink-0" />
      <div>
        <p className="text-xs uppercase font-bold text-blue-200 tracking-wider">
          {label}
        </p>
        <p
          className={`text-sm font-medium text-white capitalize ${isMonospace ? "font-mono" : ""}`}
        >
          {value || "---"}
        </p>
      </div>
    </div>
  );
}
