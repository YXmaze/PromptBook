"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto">
      <h1 className="text-6xl mb-12 font-[Lora]">Sign in to PromptBook</h1>
      <button
        onClick={handleLogin}
        className="px-[70px] py-[17px] text-[#F4F3EF] rounded-[15px] text-[36px] bg-[#434952] font-[Lora]"
      >
        Login with Google
      </button>
    </div>
  );
}
