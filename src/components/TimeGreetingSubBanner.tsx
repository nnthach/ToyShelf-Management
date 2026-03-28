"use client";

import { CalendarDays, Moon, Sun } from "lucide-react";
import { memo, useEffect, useState } from "react";

function TimeGreetingSubBanner() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Chào buổi sáng!";
    if (hour < 18) return "Chào buổi chiều!";
    return "Chào buổi tối!";
  };
  return (
    <div className="bg-linear-to-br from-white to-blue-50/50 dark:from-zinc-900 dark:to-zinc-800 shadow-sm rounded-xl col-span-1 h-[30vh] w-full flex flex-col p-5 border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
      {/* Decor background: Hình tròn mờ tạo chiều sâu */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>

      {/* Header: Ngày tháng */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <CalendarDays size={18} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            {currentTime.toLocaleDateString("vi-VN", { weekday: "long" })}
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground font-medium">
          {currentTime.toLocaleDateString("vi-VN")}
        </div>
      </div>

      {/* Center: Đồng hồ lớn */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <h3 className="text-3xl font-black text-zinc-800 dark:text-white tracking-tighter">
          {currentTime.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {currentTime.getSeconds().toString().padStart(2, "0")}
          </span>
        </h3>
        <p className="text-sm font-medium text-zinc-500 mt-1">
          {getGreeting()}
        </p>
      </div>

      {/* Footer: Thông tin thời tiết "giả lập" hoặc icon decor */}
      <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Thay đổi icon theo giờ */}
          {currentTime.getHours() >= 6 && currentTime.getHours() < 18 ? (
            <Sun className="text-orange-400" size={20} />
          ) : (
            <Moon className="text-indigo-400" size={20} />
          )}
          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
            28°C
          </span>
        </div>
        <div className="text-[11px] text-zinc-400 italic">TP. Hồ Chí Minh</div>
      </div>
    </div>
  );
}

export default memo(TimeGreetingSubBanner);
