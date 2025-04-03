"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import EventCard from "@/app/components/EventCard";

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen px-6 py-16 sm:py-24 max-w-7xl mx-auto">
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Feel the Music. Book the Experience.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Discover and book tickets to the hottest concerts in town – all in one place.
        </p>
      </section>

      <section id="events">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>

        {events.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
