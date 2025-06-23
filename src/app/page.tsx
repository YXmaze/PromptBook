import HomePage from "@/components/homepage/HomePage";
import LogoutButton from "@/components/auth/LogoutButton";
import Sidebar from "@/components/homepage/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-[#F4F3EF] min-h-screen relative">
      <SidebarProvider>
        <Sidebar />

        {/* TOP BAR */}
        <div>
          <div className="flex items-center space-x-3 px-4 py-4">
            <SidebarTrigger />
            <h2 className="text-2xl font-[Lora] font-medium">
              Mock Collection
            </h2>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <HomePage />
          <LogoutButton />
        </div>
      </SidebarProvider>
    </main>
  );
}
