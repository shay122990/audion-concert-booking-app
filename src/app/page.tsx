import EventCard from "@/app/components/EventCard";

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
};

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Summer Sound Festival",
    date: "2025-08-10",
    location: "Dubai Marina",
    image:
      "https://images.unsplash.com/photo-1603350902363-3141f62b7dba?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGR1YmFpJTIwbWFyaW5hJTIwZmVzdGl2YWx8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "2",
    title: "Indie Night Live",
    date: "2025-09-02",
    location: "The Arena, Dubai",
    image:
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXJlbmF8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "3",
    title: "EDM Bash 2025",
    date: "2025-10-15",
    location: "Palm Jumeirah",
    image:
      "https://dancingastronaut.com/wp-content/uploads/2022/01/Five-hotel_411_21.02.2020.jpg",
  },
];


export default function Home() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}
