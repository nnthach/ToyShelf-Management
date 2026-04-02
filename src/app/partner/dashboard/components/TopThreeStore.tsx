"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/styles/components/ui/card";
import {
  ShoppingCart,
  DollarSign,
  MapPin,
  User,
  Badge,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Store {
  id: string;
  name: string;
  partnerName: string;
  city: string;
  totalOrders: number;
  totalRevenue: number;
}

// Giả lập dữ liệu
const TOP_STORES: Store[] = [
  {
    id: "1",
    name: "ToyShelf Quận 1",
    partnerName: "Nguyễn Văn A",
    city: "HCM",
    totalOrders: 1200,
    totalRevenue: 25000000,
  },
  {
    id: "2",
    name: "ToyShelf Hà Nội",
    partnerName: "Trần Văn B",
    city: "Hà Nội",
    totalOrders: 980,
    totalRevenue: 21000000,
  },
  {
    id: "3",
    name: "ToyShelf Đà Nẵng",
    partnerName: "Lê Văn C",
    city: "Đà Nẵng",
    totalOrders: 870,
    totalRevenue: 18000000,
  },
];

const TopThreeStore = () => {
  const router = useRouter();
  return (
    <Card className="border-none shadow-none bg-transparent w-full h-full py-0 gap-2">
      <CardHeader className="p-0 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-bold flex items-center gap-2 uppercase tracking-tight">
          <Trophy className="w-4 h-4 text-yellow-500" />
          Cửa hàng có doanh thu cao nhất
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-1 flex-col justify-between gap-3">
        {TOP_STORES.map((store, index) => (
          <div
            key={store.id}
            onClick={() => router.push(`/admin/stores/${store.id}`)}
            className={`
  group py-3 flex flex-col gap-4 border-b last:border-none border-gray-100 rounded-lg px-3 transition-colors
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
                <div
                  className={`
    px-2 py-0.5 rounded-md text-[12px] font-bold
    ${
      index === 0
        ? "bg-yellow-100 text-yellow-700"
        : index === 1
          ? "bg-gray-200 text-gray-700"
          : index === 2
            ? "bg-orange-100 text-orange-700"
            : "bg-gray-100 text-gray-500"
    }
  `}
                >
                  Top {index + 1}
                </div>
                <span className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {store.name}
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
