import {
  Collapsible,
  CollapsibleContent,
} from "../styles/components/ui/collapsible";
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
} from "../styles/components/ui/sidebar";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { AdminSidebarGroups, AdminSidebarNested } from "../constants/menuData";
import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const AdminSidebar = () => {
  const tItem = useTranslations("admin.sidebar.item");
  const tLabel = useTranslations("admin.sidebar.label");

  return (
    <Sidebar
      collapsible="icon"
      className="[--sidebar:white] dark:[--sidebar:oklch(0.205_0_0)] overflow-hidden"
    >
      {/* Header */}
      <SidebarHeader className="min-h-[50px] p-0">
        {/* <SidebarMenu className="h-full"> */}
        {/* <SidebarMenuItem> */}
        {/* <SidebarMenuButton asChild> */}
        <Link href={"/"} className="p-2 flex items-center gap-2">
          <div className="relative w-[50px] h-[50px]">
            <Image
              src="/images/finallogo.png"
              // src="/images/final_logo_toyscabin.png"
              alt="Toyscabin logo"
              fill
              className="object-contain"
            />
          </div>
          {/*#0D47A1 */}
          <p className="text-[#1E88E5] font-bold text-xl">ToysCabin</p>
        </Link>
        {/* </SidebarMenuButton> */}
        {/* </SidebarMenuItem> */}
        {/* </SidebarMenu> */}
      </SidebarHeader>

      <SidebarSeparator />

      {/* Content */}
      <SidebarContent className="custom-scrollbar">
        {/* --- Simple groups --- */}
        {AdminSidebarGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{tLabel(group.label)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{tItem(item.title)}</span>
                      </Link>
                    </SidebarMenuButton>

                    {item.badge && (
                      <SidebarMenuBadge className="bg-green-100 text-green-700">
                        <Bell className="w-4 h-4" />
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* --- Nested collapsible sub groups --- */}
        {AdminSidebarNested.map((group) => (
          <Collapsible key={group.label} className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild className="cursor-pointer">
                <CollapsibleTrigger>
                  {tLabel(group.label)}
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.sub.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuButton asChild>
                              <Link href={item.url}>
                                <item.icon />
                                <span>{tItem(item.title)}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center gap-3 p-2 hover:bg-accent rounded-xl h-11">
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="rounded-full"
                />
              </Avatar>

              <div className="flex flex-col text-left">
                <span className="font-medium text-sm">Alex Johnson</span>
                <span className="text-xs text-muted-foreground">
                  Administrator
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
