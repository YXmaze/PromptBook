import HomePage from "@/components/homepage/HomePage";
import LogoutButton from "@/components/auth/LogoutButton";

export default function Home() {
  return (
    <>
      <main className="flex justify-center items-center h-screen">
        <HomePage />
        <LogoutButton />
      </main>
    </>
  );
}
