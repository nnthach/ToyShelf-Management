import { SidebarProvider } from "@/src/styles/components/ui/sidebar";
import { cookies } from "next/headers";
import { RolePermission } from "@/src/components/RolePermission";
import { StoreManagerClientShell } from "@/src/components/layout/StoreManagerClient";

export default async function StoreManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    // <RolePermission allowedRoles={["Warehouse"]}>
    <div className="flex bg-[#FAF9FE] dark:bg-neutral-800">
      <SidebarProvider defaultOpen={defaultOpen}>
        <StoreManagerClientShell>{children}</StoreManagerClientShell>
      </SidebarProvider>
    </div>
    // </RolePermission>
  );
}
