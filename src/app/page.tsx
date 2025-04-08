"use client";

import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import EventCard from "@/app/components/EventCard";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  category: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const data: Event[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Event, "id">),
      }));

      setEvents(data);

      const uniqueCategories = Array.from(new Set(data.map((event) => event.category))).sort();
      setCategories(["All", ...uniqueCategories]);
    };

    fetchEvents();
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category === activeCategory ? "All" : category);
  };

  const groupedEvents = categories.reduce((acc: Record<string, Event[]>, category) => {
    acc[category] = category === "All"
      ? events
      : events.filter((event) => event.category === category);
    return acc;
  }, {});

  return (
    <main className="px-6 py-12 max-w-7xl mx-auto">
      <section className="text-center mb-16 py-20 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-lg">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4">Feel the Music. Live the Experience.</h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto">Discover and book tickets to the hottest concerts around you, all in one place.</p>
      </section>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 text-sm rounded-full border transition ${
              activeCategory === category
                ? "bg-purple-600 text-white border-purple-600"
                : "hover:bg-purple-100 dark:hover:bg-purple-900 border-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {(activeCategory === "All" ? categories.slice(1) : [activeCategory]).map((category) => (
        groupedEvents[category] && groupedEvents[category].length > 0 && (
          <section key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedEvents[category].map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )
      ))}
    </main>
  );
} 
