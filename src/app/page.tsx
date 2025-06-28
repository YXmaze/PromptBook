import HomePage from "@/components/homepage/HomePage";
import LogoutButton from "@/components/auth/LogoutButton";
import Sidebar from "@/components/homepage/SideBar";
import Cell from "@/components/homepage/Cell";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-[#F4F3EF] min-h-screen flex w-full">
      <SidebarProvider>
        <Sidebar />

        {/* MAIN CONTENT WRAPPER */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* TOP BAR */}
          <div className="flex items-center space-x-3 px-4 py-4">
            <SidebarTrigger />
            <h2 className="text-2xl font-[Lora] font-medium">
              Mock Collection
            </h2>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 flex justify-center items-center px-4">
            <Cell />
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}