import {
  Collapsible,
  CollapsibleContent,
} from "../../styles/components/ui/collapsible";
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
} from "../../styles/components/ui/sidebar";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import {
  PartnerAdminSidebarGroups,
  PartnerAdminSidebarNested,
} from "../../constants/menuData";
import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { usePathname } from "next/navigation";

const PartnerAdminSidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="[--sidebar:white] dark:[--sidebar:oklch(0.205_0_0)] overflow-hidden"
    >
      {/* Header */}
      <SidebarHeader className="min-h-[50px] p-0">
        <Link
          href={"/partner/dashboard"}
          className="p-2 flex items-center gap-2"
        >
          <div className="relative w-[50px] h-[50px]">
            <Image
              src="/images/finallogo.png"
              alt="ToyShelf logo"
              fill
              className="object-contain"
            />
          </div>
          {/*#0D47A1 */}
          <p className="text-[#1E88E5] font-bold text-xl">ToyShelf</p>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Content */}
      <SidebarContent className="custom-scrollbar">
        {/* --- Simple groups --- */}
        {PartnerAdminSidebarGroups.map((group) => (
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

        {/* --- Nested collapsible sub groups --- */}
        {PartnerAdminSidebarNested.map((group) => {
          const isGroupActive = group.sub.some((item) =>
            pathname.startsWith(item.url),
          );

          return (
            <Collapsible
              key={group.label}
              defaultOpen={isGroupActive}
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel asChild className="cursor-pointer">
                  <CollapsibleTrigger
                    className={`flex items-center w-full
              ${isGroupActive ? "text-blue-600 font-medium" : ""}
            `}
                  >
                    {group.label}
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.sub.map((item) => {
                        const isActive = pathname.startsWith(item.url);
                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuSub>
                              <SidebarMenuSubItem>
                                <SidebarMenuButton asChild>
                                  <Link
                                    href={item.url}
                                    className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all
                              ${
                                isActive
                                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500 font-medium"
                                  : "text-muted-foreground hover:bg-accent"
                              }
                            `}
                                  >
                                    <item.icon
                                      className={
                                        isActive ? "text-blue-600" : ""
                                      }
                                    />
                                    <span>{item.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            </SidebarMenuSub>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarSeparator />

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center gap-3 p-2 hover:bg-accent rounded-xl h-11">
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarImage
                  src={user?.avatarUrl || "https://github.com/shadcn.png"}
                  alt="@shadcn"
                  className="rounded-full"
                />
              </Avatar>

              <div className="flex flex-col text-left">
                <span className="font-medium text-sm">{user?.fullName}</span>
                <span className="text-xs text-muted-foreground">Đối tác</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default PartnerAdminSidebar;
