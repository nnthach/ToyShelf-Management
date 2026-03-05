import { SidebarProvider } from "../../styles/components/ui/sidebar";
import { cookies } from "next/headers";
import PartnerAdminSidebar from "@/src/components/layout/PartnerAdminSidebar";
import PartnerAdminNavbar from "@/src/components/layout/PartnerAdminNavbar";
import { PartnerAdminClientShell } from "@/src/components/layout/PartnerAdminClient";
import { RolePermission } from "@/src/components/RolePermission";

export default async function PartnerAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    // <div className="flex bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-800">
    //   <SidebarProvider defaultOpen={defaultOpen}>
    //     <PartnerAdminSidebar />
    //     <main className="flex-1">
    //       <PartnerAdminNavbar />
    //       <div className="px-4 mt-4">{children}</div>
    //     </main>
    //   </SidebarProvider>
    // </div>
    // <RolePermission allowedRoles={["PartnerAdmin"]}>
    <div className="flex bg-[#FAF9FE] dark:bg-neutral-800">
      <SidebarProvider defaultOpen={defaultOpen}>
        <PartnerAdminClientShell>{children}</PartnerAdminClientShell>
      </SidebarProvider>
    </div>
    // </RolePermission>
  );
}
