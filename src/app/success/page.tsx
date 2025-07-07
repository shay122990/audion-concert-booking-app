"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SuccessPage() {
  const { user, loading, role, roleLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || roleLoading) return;

    if (!user) {
      router.push("/login");
    } else if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/profile");
    }
  }, [user, role, loading, roleLoading, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700 dark:text-gray-300">
        Processing your ticket...
      </p>
    </main>
  );
}
