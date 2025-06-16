"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut(auth)}
      className="bg-red-500 text-white p-2 rounded"
    >
      Logout
    </button>
  );
}
