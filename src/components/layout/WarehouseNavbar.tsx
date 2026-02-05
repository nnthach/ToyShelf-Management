"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../styles/components/ui/avatar";
import { Button } from "../../styles/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../styles/components/ui/dropdown-menu";
import { useSidebar } from "../../styles/components/ui/sidebar";
import {
  ChevronLeft,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

const WarehouseNavbar = () => {
  const { theme, setTheme } = useTheme();
  const { open, toggleSidebar } = useSidebar();

  return (
    <nav className="p-4 flex items-center justify-between bg-white dark:bg-sidebar">
      {/*left */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size={"sm"} onClick={toggleSidebar}>
          {open ? <ChevronLeft /> : <Menu />}
        </Button>

        <h5 className="font-bold text-lg">Bảng điều khển</h5>
      </div>
      {/*right */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} className="mr-2">
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User />
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings />
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" className="cursor-pointer">
              <LogOut />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default WarehouseNavbar;
