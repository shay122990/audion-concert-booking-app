"use client";

import Image from "next/image";
import { CiUser } from "react-icons/ci";

type UserCardProps = {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;

  // shown only when provided
  roleLabel?: string;

  // size tweaks (optional)
  variant?: "admin" | "profile";
};

export default function UserCard({
  displayName,
  email,
  photoURL,
  roleLabel,
  variant = "profile",
}: UserCardProps) {
  const isAdminVariant = variant === "admin";

  return (
    <section className="flex flex-row items-center gap-6 mb-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl">
      <div
        className={
          isAdminVariant
            ? "w-28 h-20 relative bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            : "w-28 h-20 relative bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
        }
      >
        {photoURL ? (
          <Image
            src={photoURL}
            alt="User Profile Picture"
            fill
            className="object-cover"
          />
        ) : isAdminVariant ? (
          <CiUser className="text-6xl text-purple-500" />
        ) : (
          <CiUser className="text-6xl text-purple-500" />
        )}
      </div>

      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-semibold">
          {displayName || (isAdminVariant ? "Admin User" : "Guest User")}
        </h2>

        {email && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
        )}

        {roleLabel && (
          <p className="text-xs text-purple-600 font-medium mt-2">
            Role: {roleLabel}
          </p>
        )}
      </div>
    </section>
  );
}
