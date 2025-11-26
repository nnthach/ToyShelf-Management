import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";
import { SidebarProvider } from "@/styles/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className="flex">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AdminSidebar />
        <main className="flex-1">
          <AdminNavbar />
          <div className="px-4">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
