// for now visit http://localhost:3000/admin to access this page 
"use client";

import { addMockEvents, deleteAllEvents } from "@/app/lib/firebase";

export default function AdminPage() {
  const handleAddEvents = async () => {
    try {
      await addMockEvents();
      alert("✅ Mock events uploaded to Firestore!");
    } catch (error) {
      console.error("❌ Failed to upload events:", error);
      alert("Something went wrong. Check the console.");
    }
  };

  const handleDeleteEvents = async () => {
    const confirm = window.confirm("Are you sure you want to delete ALL events?");
    if (!confirm) return;

    try {
      await deleteAllEvents();
      alert("🗑️ All events deleted from Firestore.");
    } catch (error) {
      console.error("❌ Failed to delete events:", error);
      alert("Something went wrong. Check the console.");
    }
  };

  return (
    <main className="min-h-screen px-6 py-24 max-w-xl mx-auto flex flex-col items-center text-center gap-6">
      <h1 className="text-3xl font-bold text-purple-600">Audion Admin</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Manage your mock event data in Firestore.
      </p>

      <button
        onClick={handleAddEvents}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Upload Events from File
      </button>

      <button
        onClick={handleDeleteEvents}
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Delete All Events
      </button>
    </main>
  );
}
