import { SidebarProvider } from "../../styles/components/ui/sidebar";
import { cookies } from "next/headers";
import WarehouseSidebar from "@/src/components/layout/WarehouseSidebar";
import WarehouseNavbar from "@/src/components/layout/WarehouseNavbar";

export default async function PartnerAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className="flex bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-800">
      <SidebarProvider defaultOpen={defaultOpen}>
        <WarehouseSidebar />
        <main className="flex-1">
          <WarehouseNavbar />
          <div className="px-4 mt-4">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
