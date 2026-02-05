import { SidebarProvider } from "../../styles/components/ui/sidebar";
import { cookies } from "next/headers";
import { RolePermission } from "@/src/components/RolePermission";
import { AdminClientShell } from "@/src/components/layout/AdminClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    //bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-800
    // <RolePermission allowedRoles={["Admin"]}>
    <div className="flex bg-slate-100 dark:bg-neutral-800">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AdminClientShell>{children}</AdminClientShell>
      </SidebarProvider>
    </div>
    // </RolePermission>
  );
}
