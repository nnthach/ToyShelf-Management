import { SidebarProvider } from "../../styles/components/ui/sidebar";
import { cookies } from "next/headers";
import { PartnerAdminClientShell } from "@/src/components/layout/PartnerAdminClient";
import { RolePermission } from "@/src/components/RolePermission";
import { redirect } from "next/navigation";

export default async function PartnerAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <RolePermission allowedRoles={["PartnerAdmin"]}>
      <div className="flex bg-[#FAF9FE] dark:bg-neutral-800">
        <SidebarProvider defaultOpen={defaultOpen}>
          <PartnerAdminClientShell>{children}</PartnerAdminClientShell>
        </SidebarProvider>
      </div>
    </RolePermission>
  );
}
