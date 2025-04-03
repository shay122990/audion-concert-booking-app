import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const addMockEvents = async () => {
    try {
      const eventsRef = collection(db, "events");
  
      const mockEvents = [
        {
          title: "Summer Sound Festival",
          date: "2025-08-10",
          location: "Dubai Marina",
          image: "https://images.unsplash.com/photo-1603350902363-3141f62b7dba?w=800",
        },
        {
          title: "Indie Night Live",
          date: "2025-09-02",
          location: "The Arena, Dubai",
          image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800",
        },
        {
          title: "EDM Bash 2025",
          date: "2025-10-15",
          location: "Palm Jumeirah",
          image: "https://dancingastronaut.com/wp-content/uploads/2022/01/Five-hotel_411_21.02.2020.jpg",
        },
      ];
  
      for (const event of mockEvents) {
        await addDoc(eventsRef, event);
        console.log(`✅ Added: ${event.title}`);
      }
  
      console.log("🎉 All mock events added to Firestore");
    } catch (error) {
      console.error("❌ Error adding events:", error);
    }
  };
  