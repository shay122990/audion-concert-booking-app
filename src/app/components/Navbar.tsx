"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, signInWithGoogle, logout, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  const closeMenu = () => setIsOpen(false);

  if (authLoading || roleLoading) return null;

  return (
    <header className="w-full px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/60 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-600">
          Audion
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className={pathname === "/" ? "text-purple-600" : "hover:text-purple-600"}>
            Home
          </Link>

          {user && role === "admin" && (
            <Link href="/admin" className="hover:text-purple-600">Admin</Link>
          )}

          {user && role === "user" && (
            <Link href="/profile" className="hover:text-purple-600">Profile</Link>
          )}

          {!user ? (
            <button onClick={signInWithGoogle} className="text-sm text-purple-600 hover:underline">Login</button>
          ) : (
            <button onClick={logout} className="text-sm text-gray-600 hover:text-purple-600">Logout</button>
          )}
        </nav>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={closeMenu}
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-3/4 max-w-xs bg-black/60 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 h-dvh flex flex-col text-center gap-6 text-sm bg-black/60 text-white">
          <button onClick={closeMenu} className="self-end hover:text-purple-600" aria-label="Close menu">✕</button>
          <Link href="/" onClick={closeMenu} className="hover:text-purple-600">Home</Link>

          {user && role === "admin" && (
            <Link href="/admin" onClick={closeMenu} className="hover:text-purple-600">Admin</Link>
          )}

          {user && role === "user" && (
            <Link href="/profile" onClick={closeMenu} className="hover:text-purple-600">Profile</Link>
          )}

          {!user ? (
            <button onClick={signInWithGoogle} className="text-sm text-purple-400">Login</button>
          ) : (
            <button onClick={logout} className="text-sm text-white hover:text-purple-400">Logout</button>
          )}
        </div>
      </aside>
    </header>
  );
}
