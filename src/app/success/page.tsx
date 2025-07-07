"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

export default function SuccessPage() {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || roleLoading) return;

    if (user) {
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    } else {
      router.push("/login");
    }
  }, [user, role, authLoading, roleLoading, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700 dark:text-gray-300">
        Processing your ticket...
      </p>
    </main>
  );
}
