"use client"
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
    <main className="px-6 mt-30 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative text-center lg:mt-20 mb-4 md:mb-10 py-16 sm:py-32 px-6 bg-gradient-to-r from-red-500 via-pink-600 to-purple-800 text-white rounded-3xl shadow-xl overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/20 via-black/30 to-transparent opacity-70"></div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-teal-400 drop-shadow-lg leading-tight">
            Feel the Music.<br className="hidden sm:block" />Live the Experience.
          </h1>
          <p className="text-lg sm:text-2xl max-w-2xl mx-auto font-light drop-shadow-md">
            Discover and book tickets to the hottest concerts around you – electrify your nights, all in one place.
          </p>

          <div className="mt-8 flex justify-center gap-6">
            <button
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-purple-600 text-lg font-semibold text-white rounded-full hover:from-teal-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              onClick={() => window.scrollTo(0, window.innerHeight)}
            >
              Discover Events
            </button>
            <button
              className="px-8 py-4 bg-transparent border-2 border-white text-lg font-semibold text-white rounded-full hover:bg-white hover:text-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
              onClick={() => window.scrollTo(0, window.innerHeight)}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Search Bar and Categories */}
      <div className="flex flex-wrap justify-center gap-2 lg:gap-8 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 text-sm lg:text-2xl rounded-full border transition ${
              activeCategory === category
                ? "bg-purple-600 text-white border-purple-600"
                : "hover:bg-purple-100 dark:hover:bg-purple-900 border-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Event Search Bar */}
      <EventSearchBar<Event>
        data={events}
        onFilter={setFilteredEvents}
        keysToSearch={["title", "location", "category", "description", "lineup"]}
      />

      {/* Dynamic Section Between Events (Featured Event/Trending Events) */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-20 rounded-3xl mb-12 shadow-xl">
        <h2 className="text-3xl font-semibold mb-6">Trending Events</h2>
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupedEvents['All'] && groupedEvents['All'].slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Event Cards Grid */}
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
