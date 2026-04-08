import {
  Collapsible,
  CollapsibleContent,
} from "@/src/styles/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/src/styles/components/ui/sidebar";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import {
  WarehouseManagerSidebarGroups,
  WarehouseManagerSidebarNested,
} from "../../constants/menuData";
import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { usePathname } from "next/navigation";
import { cn } from "@/src/styles/lib/utils";

const WarehouseSidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="[--sidebar:white] dark:[--sidebar:oklch(0.205_0_0)] overflow-hidden"
    >
      {/* Header */}
      <SidebarHeader className="min-h-12.5 p-0">
        <Link href={"/admin/dashboard"} className="p-2 flex items-center gap-2">
          <div className="relative w-12.5 h-12.5">
            <Image
              src="/images/finallogo.png"
              alt="ToyShelf logo"
              fill
              className="object-contain"
            />
          </div>
          {!isCollapsed && (
            <p className="text-[#1E88E5] font-bold text-xl whitespace-nowrap">
              ToyShelf
            </p>
          )}
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Content */}
      <SidebarContent className="custom-scrollbar">
        {/* --- Simple groups --- */}
        {WarehouseManagerSidebarGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={`flex items-center gap-2 px-2 py-1 rounded-md transition-colors
            ${
              isActive
                ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500 font-medium"
                : "text-muted-foreground hover:bg-accent"
            }
          `}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>

                      {item.badge && (
                        <SidebarMenuBadge className="bg-green-100 text-green-700">
                          <Bell className="w-4 h-4" />
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={cn(
                "flex items-center rounded-xl h-11 hover:bg-accent",
                isCollapsed ? "justify-center p-0 gap-0" : "gap-3 p-2",
              )}
            >
              <Avatar className="h-10 w-10 shrink-0 rounded-full overflow-hidden">
                <AvatarImage
                  src={user?.avatarUrl || "https://github.com/shadcn.png"}
                  alt="@shadcn"
                  className="rounded-full"
                />
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col text-left min-w-0">
                  <span className="font-medium text-sm truncate">
                    {user?.fullName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    Quản lý kho
                  </span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default WarehouseSidebar;
