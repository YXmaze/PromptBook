"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { createUserIfNotExists } from "../../app/actions/createUser";

export default function LoginForm() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      router.push("/");

      await createUserIfNotExists({
        id: result.user.uid,
        email: result.user.email ?? "",
        name: result.user.displayName,
      });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="px-6 py-2 bg-blue-600 text-white rounded"
    >
      Login with Google
    </button>
  );
}
