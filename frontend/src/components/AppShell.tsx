import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function AppShell() {
  return (
    <div className="flex min-h-screen bg-[#f4f7fb]">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 xl:p-8">
        <Header />
        <div className="mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
