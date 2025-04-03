import { db } from "@/app/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import Image from "next/image";

type Props = {
  params: {
    id: string;
  };
};

export default async function EventDetailsPage({ params }: Props) {
  const eventRef = doc(collection(db, "events"), params.id);
  const eventSnap = await getDoc(eventRef);

  if (!eventSnap.exists()) {
    return notFound();
  }

  const event = eventSnap.data() as {
    title: string;
    image: string;
    date: string;
    location: string;
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Image
          src={event.image}
          alt={event.title}
          width={800}
          height={400}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        📍 {event.location} • 📅 {event.date}
      </p>

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-10">
        Get ready for an unforgettable experience at <strong>{event.title}</strong>! Reserve your
        spot now before tickets sell out.
      </p>
    {/* Add date picket to book later in this section */}
      <button className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
        Continue to Booking
      </button>
    </main>
  );
}
