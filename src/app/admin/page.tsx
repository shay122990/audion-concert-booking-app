// This component was created to temporarily add events to firestore, in the future there would be an admin login to handle event updates

"use client";

import { addMockEvents } from "@/app/lib/firebase";

export default function AdminSetupPage() {
  const handleAddEvents = async () => {
    try {
      await addMockEvents();
      alert("Mock events successfully uploaded to Firestore ✅");
    } catch (error) {
      alert("Something went wrong. Check the console.");
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen px-6 py-24 max-w-3xl mx-auto flex flex-col items-center justify-center text-center gap-6">
      <h1 className="text-3xl font-bold text-purple-600">Audion Admin</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Use this panel to seed or update mock event data in Firestore.
      </p>
      <button
        onClick={handleAddEvents}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Add Mock Events to Firestore
      </button>
    </main>
  );
}
