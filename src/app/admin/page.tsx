// for now visit http://localhost:3000/admin to access this page later this page will be accessed though auth login
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { addMockEvents, deleteAllEvents, deleteEventById } from "@/app/lib/firebase";

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
};

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Event, "id">),
    }));
    setEvents(data);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Delete this event?");
    if (!confirm) return;

    await deleteEventById(id);
    await fetchEvents(); 
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen px-6 py-24 max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
      <h1 className="text-3xl font-bold text-purple-600">Audion Admin</h1>

      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={addMockEvents}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Upload Events from File
        </button>

        <button
          onClick={async () => {
            const confirm = window.confirm("Delete ALL events?");
            if (!confirm) return;

            await deleteAllEvents();
            await fetchEvents();
          }}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete All Events
        </button>
      </div>

      <section className="w-full mt-12">
        <h2 className="text-xl font-semibold mb-4">Current Events</h2>
        <ul className="space-y-4">
          {events.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
          ) : (
            events.map((event) => (
              <li
                key={event.id}
                className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-lg shadow"
              >
                <div className="text-left">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.date} • {event.location}</p>
                </div>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-sm px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}
