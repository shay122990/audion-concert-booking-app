"use client";

import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import EventCard from "@/app/components/EventCard";
import EventSearchBar from "./components/EventSearchBar";
import { Event } from "@/app/types/event";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const data: Event[] = snapshot.docs.map((doc) => {
        const rawData = doc.data() as Partial<Event>;
        return {
          id: doc.id,
          title: rawData.title || "",
          dates: Array.isArray(rawData.dates) ? rawData.dates : [],
          startTime: rawData.startTime || "", 
          doorsOpenTime: rawData.doorsOpenTime || "", 
          endTime: rawData.endTime || "", 
          location: rawData.location || "",
          image: rawData.image || "",
          category: rawData.category || "",
          description: rawData.description || "",
          lineup: Array.isArray(rawData.lineup) ? rawData.lineup : [],
          price: typeof rawData.price === "number" ? rawData.price : 0,
        };
      });

      setEvents(data);
      setFilteredEvents(data);

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
      ? filteredEvents
      : filteredEvents.filter((event) => event.category === category);
    return acc;
  }, {});

  return (
    <main className="px-6 py-12 max-w-7xl mx-auto">
      <section className="relative text-center mb-20 py-32 sm:py-40 px-4 bg-gradient-to-r from-purple-700 via-pink-500 to-red-400 text-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-white/5 to-transparent opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 drop-shadow-lg leading-tight">
            Feel the Music.<br className="hidden sm:block" />Live the Experience.
          </h1>
          <p className="text-lg sm:text-2xl max-w-3xl mx-auto font-light drop-shadow-md">
            Discover and book tickets to the hottest concerts around you – electrify your nights, all in one place.
          </p>
        </div>
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
      
      <EventSearchBar<Event>
        data={events}
        onFilter={setFilteredEvents}
        keysToSearch={["title", "location", "category", "description", "lineup"]}
      />
      
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
