import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import mockEvents from "@/data/mock-events";
import { Event } from "@/app/types/event";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

type NewEvent = Omit<Event, "id">;// excluding id, which is handled/generated by firestore

export const addMockEvents = async (): Promise<"uploaded" | "already-exists" | "error"> => {
  try {
    const eventsRef = collection(db, "events");
    const snapshot = await getDocs(eventsRef);

    const existingTitles = snapshot.docs.map((doc) =>
      String(doc.data().title).toLowerCase().trim()
    );

    let addedCount = 0;

    for (const event of mockEvents) {
      if (typeof event.title !== "string") continue;

      const titleKey = event.title.toLowerCase().trim();
      if (!existingTitles.includes(titleKey)) {
        await addDoc(eventsRef, event);
        addedCount++;
      }
    }

    return addedCount === 0 ? "already-exists" : "uploaded";
  } catch (error) {
    console.error("❌ Error adding mock events:", error);
    return "error";
  }
};
// add single event through admin page
export const addEvent = async (event: NewEvent) => {
  try {
    if (!event.title.trim()) {
      throw new Error("Event title is required.");
    }

    await addDoc(collection(db, "events"), event);
    console.log("✅ Added event:", event.title);
  } catch (error) {
    console.error("❌ Error adding event:", error);
    throw error;
  }
};


export const deleteAllEvents = async () => {
  try {
    const eventsRef = collection(db, "events");
    const snapshot = await getDocs(eventsRef);

    const deletions = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(eventsRef, docSnap.id))
    );

    await Promise.all(deletions);
    console.log("🗑️ All events deleted from Firestore.");
  } catch (error) {
    console.error("❌ Error deleting events:", error);
  }
};

//delete a single event through admin page
export const deleteEventById = async (id: string) => {
  try {
    await deleteDoc(doc(db, "events", id));
    console.log(`🗑️ Deleted event with ID: ${id}`);
  } catch (error) {
    console.error("❌ Failed to delete event:", error);
    throw error;
  }
};

//update an event through admin page
export const updateEventById = async (
  id: string,
  updatedData: Partial<NewEvent>
) => {
  try {
    const ref = doc(db, "events", id);
    await updateDoc(ref, updatedData);
    console.log(`✏️ Updated event: ${id}`);
  } catch (error) {
    console.error("❌ Error updating event:", error);
    throw error;
  }
};

//save booking to specific user
export const saveBooking = async ({
  userId,
  eventId,
  selectedDate,
  ticketQuantity,
}: {
  userId: string;
  eventId: string;
  selectedDate: string;
  ticketQuantity: number;  
}) => {
  const userBookingRef = collection(doc(db, "users", userId), "bookings");
  await addDoc(userBookingRef, {
    eventId,
    selectedDate,
    ticketQuantity,  
    bookedAt: new Date().toISOString(),
  });
};

