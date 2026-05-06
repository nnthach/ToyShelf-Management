"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/styles/components/ui/card";
import { ShoppingCart, DollarSign, MapPin, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { getDashboardTopStoreAPI } from "@/src/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";

interface Store {
  storeId: string;
  storeName: string;
  partnerName: string;
  city: string;
  totalOrders: number;
  totalRevenue: number;
}

const TopThreeStore = () => {
  const router = useRouter();

  const [query, setQuery] = useState({
    month: "",
    year: "",
  });

  const { data: topStores, isLoading } = useQuery({
    queryKey: ["topStores", query],
    queryFn: () => getDashboardTopStoreAPI(query),
    select: (res) => res.data as Store[],
  });

  const handleMonthYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value) {
      setQuery({ month: "", year: "" });
      return;
    }

    const [year, month] = value.split("-");
    setQuery({
      year: year,
      month: parseInt(month).toString(),
    });
  };

  const monthYearValue =
    query.year && query.month
      ? `${query.year}-${query.month.padStart(2, "0")}`
      : "";
  return (
    <Card className="border-none shadow-none bg-transparent w-full h-full py-0 gap-2">
      <CardHeader className="p-0 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-bold flex items-center gap-2 uppercase tracking-tight">
          <Trophy className="w-4 h-4 text-yellow-500" />
          Xếp hạng cửa hàng
        </CardTitle>

        <div className="relative group">
          <input
            type="month"
            value={monthYearValue}
            onChange={handleMonthYearChange}
            className="text-[11px] font-bold bg-slate-100 hover:bg-slate-200 transition-colors px-2 py-1 rounded-md outline-none cursor-pointer text-slate-600 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-1 flex-col overflow-y-auto custom-scrollbar gap-3">
        {topStores?.map((store, index) => (
          <div
            key={store.storeId}
            onClick={() => router.push(`/admin/stores/${store.storeId}`)}
            className={`
  group cursor-pointer py-3 flex flex-col gap-4 border-b last:border-none border-gray-100 rounded-lg px-3 transition-colors
  ${
    index === 0
      ? "bg-yellow-50"
      : index === 1
        ? "bg-gray-50"
        : index === 2
          ? "bg-orange-50"
          : "hover:bg-gray-50/50"
  }
`}
          >
            {/* Dòng 1: Rank + Name + City */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {store.storeName}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[12px] text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                <MapPin size={10} />
                {store.city}
              </div>
            </div>

            {/* Dòng 2: Partner */}
            <div className="">
              <p className="text-xs text-gray-500 -mt-1">
                Đối tác:{" "}
                <span className="font-medium text-gray-700">
                  {store.partnerName}
                </span>
              </p>
            </div>

            {/* Dòng 3: Stats (Gọn gàng trên 1 dòng) */}
            {/* --- BOTTOM: STATS (Xếp chồng dòng, Trái Icon/Title - Phải Value) --- */}
            <div className="flex flex-col gap-2">
              {/* Dòng Doanh thu */}
              <div className="flex items-center justify-between group/item">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-emerald-50 rounded-md group-hover/item:bg-emerald-100 transition-colors">
                    <DollarSign size={14} className="text-emerald-600" />
                  </div>
                  <span className="text-[11px] text-gray-500 uppercase font-semibold tracking-wide">
                    Doanh thu
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {store.totalRevenue.toLocaleString()}đ
                </span>
              </div>

              {/* Dòng Đơn hàng */}
              <div className="flex items-center justify-between group/item">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-50 rounded-md group-hover/item:bg-blue-100 transition-colors">
                    <ShoppingCart size={14} className="text-blue-600" />
                  </div>
                  <span className="text-[11px] text-gray-500 uppercase font-semibold tracking-wide">
                    Đơn hàng
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {store.totalOrders.toLocaleString()}{" "}
                  <span className="text-[10px] font-normal text-gray-400">
                    đơn
                  </span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopThreeStore;
