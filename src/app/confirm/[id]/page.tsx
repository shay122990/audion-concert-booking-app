"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, collection } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import ConfirmationSummary from "@/app/components/ConfirmationSummary";
import { Event } from "@/app/types/event";

const ConfirmationPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchEvent = async () => {
      const eventRef = doc(collection(db, "events"), id);
      const eventSnap = await getDoc(eventRef);

      if (!eventSnap.exists()) {
        router.push("/"); 
        return;
      }

      const data = eventSnap.data();
      setEvent({ id, ...data } as Event);
    };

    fetchEvent();
  }, [id, router]);

  if (!event) return <p className="text-center py-12">Loading...</p>;

  const selectedDate = searchParams.get("date") || event.date;

  return (
    <div className="px-6 py-16">
      <ConfirmationSummary
        eventTitle={event.title}
        // selectedDate={selectedDate}
        // selectedTime={event.time}
        location={event.location}
        image={event.image}
      />
    </div>
  );
};

export default ConfirmationPage;
