import { SidebarProvider } from "@/src/styles/components/ui/sidebar";
import { cookies } from "next/headers";
import { RolePermission } from "@/src/components/RolePermission";
import { WarehouseClientShell } from "@/src/components/layout/WarehouseClient";

export default async function WarehouseManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <RolePermission allowedRoles={["Warehouse"]}>
      <div className="flex bg-[#FAF9FE] dark:bg-neutral-800">
        <SidebarProvider defaultOpen={defaultOpen}>
          <WarehouseClientShell>{children}</WarehouseClientShell>
        </SidebarProvider>
      </div>
    </RolePermission>
  );
}
