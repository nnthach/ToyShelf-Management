"use client";

import { useAuth } from "@/src/hooks/useAuth";
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
import { ChevronLeft, Lock, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useAccountAdminModal } from "@/src/context/AccountAdminModalContext";

const PartnerAdminNavbar = () => {
  const { theme, setTheme } = useTheme();
  const { open, toggleSidebar } = useSidebar();
  const { logout, user } = useAuth();
  const { openProfile, openChangePassword } = useAccountAdminModal();

  return (
    <nav className="sticky top-0 z-10 w-full h-16.5 shadow-xs bg-white dark:bg-sidebar p-4 flex justify-between items-center">
      {/*left */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size={"sm"} onClick={toggleSidebar}>
          {open ? <ChevronLeft /> : <Menu />}
        </Button>

        <h5 className="font-semibold text-lg">Hệ thống dành cho đối tác</h5>
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
            <Avatar className="border border-black/50 shadow-sm">
              <AvatarImage
                src={user?.avatarUrl || "https://github.com/shadcn.png"}
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} className="mr-2">
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openProfile} className="cursor-pointer">
              <User />
              Thông tin
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={openChangePassword}
              className="cursor-pointer"
            >
              <Lock />
              Đặt lại mật khẩu
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={logout}
            >
              <LogOut />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default PartnerAdminNavbar;
