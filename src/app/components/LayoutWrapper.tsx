"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/app/components/Navbar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading: authLoading } = useAuth();
  const { loading: roleLoading } = useAuth();

  const isLoading = authLoading || roleLoading;

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
