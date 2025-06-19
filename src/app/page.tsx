import HomePage from "@/components/homepage/HomePage";
import LogoutButton from "@/components/auth/LogoutButton";
import Drawer from "@/components/homepage/Drawer";

export default function Home() {
  return (
    <main className="bg-[#F4F3EF] relative min-h-screen">
      <div className="flex absolute">
        <Drawer />
      </div>
      <div className="flex justify-center items-center h-screen">
        <HomePage />
        <LogoutButton />
      </div>
    </main>
  );
}
