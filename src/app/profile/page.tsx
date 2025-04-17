"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-purple-600 mb-8">My Profile</h1>

      <section className="flex flex-col sm:flex-row items-center gap-6 mb-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <div className="w-28 h-28 relative rounded-full overflow-hidden">
          <Image
            src={user?.photoURL || "/shay250.png"}
            alt="Profile Picture"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold">{user?.displayName || "Guest User"}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example ticket card */}
          <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900">
            <h3 className="text-lg font-bold text-purple-600">EDM Bash 2025</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">📅 Oct 15, 2025</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">📍 Palm Jumeirah</p>
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              View Ticket
            </button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <p className="text-gray-500 dark:text-gray-400">Coming soon: favorite artists, categories, and notification settings.</p>
      </section>

      <div className="flex flex-col sm:flex-row gap-4">
        <button className="px-6 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50 dark:hover:bg-purple-900">
          Edit Profile
        </button>
        <button className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </main>
  );
}
