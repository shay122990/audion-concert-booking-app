import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  updateDoc
} from "firebase/firestore";
import mockEvents from "@/data/mock-events";

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
// The addMockEvents function will check if there are existing title events, if so it will skip and add only newly added events in the mock-events file, this way there would be no duplicates 
export const addMockEvents = async () => {
  try {
    const eventsRef = collection(db, "events");
    const snapshot = await getDocs(eventsRef);

    const existingTitles = snapshot.docs.map((doc) =>
      doc.data().title.toLowerCase().trim()
    );

    let addedCount = 0;

    for (const event of mockEvents) {
      const titleKey = event.title.toLowerCase().trim();
      if (!existingTitles.includes(titleKey)) {
        await addDoc(eventsRef, event);
        console.log(`✅ Added: ${event.title}`);
        addedCount++;
      } else {
        console.log(`⚠️ Skipped duplicate: ${event.title}`);
      }
    }

    if (addedCount === 0) {
      console.log("ℹ️ No new events added. All already exist.");
    } else {
      console.log(`🎉 ${addedCount} new events added to Firestore`);
    }
  } catch (error) {
    console.error("❌ Error adding events:", error);
  }
};
export const addEvent = async (event: {
  title: string;
  date: string;
  location: string;
  image: string;
}) => {
  try {
    const newRef = doc(collection(db, "events")); 
    await setDoc(newRef, event);
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


export const deleteEventById = async (id: string) => {
  try {
    await deleteDoc(doc(db, "events", id));
    console.log(`🗑️ Deleted event with ID: ${id}`);
  } catch (error) {
    console.error("❌ Failed to delete event:", error);
    throw error;
  }
};
export const updateEventById = async (id: string, updatedData: Partial<{
  title: string;
  date: string;
  location: string;
  image: string;
}>) => {
  try {
    const ref = doc(db, "events", id);
    await updateDoc(ref, updatedData);
    console.log(`✏️ Updated event: ${id}`);
  } catch (error) {
    console.error("❌ Error updating event:", error);
    throw error;
  }
};