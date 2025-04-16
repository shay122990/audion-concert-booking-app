import Image from "next/image";
import Link from "next/link";
import { Event } from "@/app/types/event";

type Props = {
  event: Event;
};

export default function EventCard({ event }: Props) {
  const firstDate = event.dates && event.dates[0];

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
        <div className="text-sm text-gray-500">
          {firstDate && event.startTime ? (
            <p>
              {firstDate} • {event.startTime}
            </p>
          ) : (
            <p>No date or time available</p>
          )}
        </div>

        <p className="text-sm text-gray-500">{event.location}</p>
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
