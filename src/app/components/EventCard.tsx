// src/app/components/EventCard.tsx
import Image from "next/image";
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
};

type Props = {
  event: Event;
};

export default function EventCard({ event }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <Image
        src={event.image}
        alt={event.title}
        width={500}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
        <p className="text-sm text-gray-500">
          {event.date} • {event.location}
        </p>
        <Link
          href={`/events/${event.id}`}
          className="inline-block mt-4 text-purple-600 hover:underline font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
