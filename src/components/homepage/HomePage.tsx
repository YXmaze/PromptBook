"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <main className="p-8">
      <Sheet>
        <SheetTrigger asChild>
          <PanelLeft />
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex justify-end">
            <SheetClose asChild>
              <PanelLeft />
            </SheetClose>
          </div>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user.displayName || "User"}!
        </h1>
        <p className="text-gray-600">This is your mock dashboard 👋</p>
      </div>
    </main>
  );
}
