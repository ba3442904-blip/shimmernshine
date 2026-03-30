import { Roboto } from "next/font/google";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import NumberInputGuard from "@/components/NumberInputGuard";

const roboto = Roboto({
  variable: "--font-admin",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`admin-scope flex min-h-screen bg-[var(--bg)] ${roboto.variable}`}>
      <NumberInputGuard />
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
