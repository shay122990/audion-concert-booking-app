"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
  db,
  addMockEvents,
  deleteAllEvents,
  deleteEventById,
  addEvent,
  updateEventById,
} from "@/app/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole"; 
import EventSearchBar from "@/app/components/EventSearchBar";
import { Event } from "@/app/types/event";

const CATEGORIES = [
  "EDM", "Indie", "Pop", "Rock", "Jazz", "Classical",
  "R&B", "Local Events", "Festivals", "Underground", "Other"
];

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    image: "",
    category: "EDM",
    description: "",
    lineup: "",
  });
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "uploaded" | "exists" | "error">("idle");
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "deleting" | "deleted" | "error">("idle");
  const RESET_DELAY = 3000; 

  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(); 
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user || role !== "admin") {
        router.push("/");
      }
    }
  }, [user, role, authLoading, roleLoading, router]);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    const data: Event[] = snapshot.docs.map((doc) => {
      const rawData = doc.data() as Partial<Event>;
      return {
        id: doc.id,
        title: rawData.title || "",
        date: rawData.date || "",
        time: rawData.time || "",
        location: rawData.location || "",
        image: rawData.image || "",
        category: rawData.category || "",
        description: rawData.description || "",
        lineup: Array.isArray(rawData.lineup) ? rawData.lineup : [],
      };
    });
    setEvents(data);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Delete this event?");
    if (!confirm) return;
    await deleteEventById(id);
    await fetchEvents();
  };

  const handleEdit = (event: Event) => {
    setEditingEventId(event.id);
    setEditFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image ?? "",
      category: event.category,
      description: event.description,
      lineup: event.lineup?.join(", ") ?? "",
    });
  };

  const handleSave = async (id: string) => {
    const original = events.find((e) => e.id === id);
    if (!original) return;

    const updated = {
      title: editFormData.title || original.title,
      date: editFormData.date || original.date,
      time: editFormData.time || original.time,
      location: editFormData.location || original.location,
      image: editFormData.image || original.image,
      category: editFormData.category || original.category,
      description: editFormData.description || original.description,
      lineup: editFormData.lineup
        ? editFormData.lineup.split(",").map((s) => s.trim())
        : original.lineup,
    };

    await updateEventById(id, updated);
    setEditingEventId(null);
    await fetchEvents();
  };

  useEffect(() => {
    if (user && role === "admin") fetchEvents(); 
  }, [user, role]);

  if (authLoading || roleLoading || !user) {
    return <p className="text-center py-12">Loading...</p>; 
  }

  return (
    <main className="min-h-screen px-6 py-24 max-w-3xl mx-auto flex flex-col items-center text-center gap-6 border rounded my-10">
      <h1 className="text-3xl font-bold text-purple-600">Audion Admin</h1>
      {/* add all events from file or delete all events */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={async () => {
            setUploadStatus("uploading");
            const result = await addMockEvents();
            await fetchEvents();

            if (result === "uploaded") {
              setUploadStatus("uploaded");
              setTimeout(() => setUploadStatus("idle"), RESET_DELAY);
            } else if (result === "already-exists") {
              setUploadStatus("exists");
              setTimeout(() => setUploadStatus("idle"), RESET_DELAY);
            } else {
              setUploadStatus("error");
            }
          }}
          className={`px-6 py-3 rounded-lg transition text-white ${
            uploadStatus === "uploaded"
              ? "bg-green-600 hover:bg-green-700"
              : uploadStatus === "exists"
              ? "bg-gray-500"
              : uploadStatus === "error"
              ? "bg-red-600"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {uploadStatus === "uploading"
            ? "Uploading..."
            : uploadStatus === "uploaded"
            ? "✅ Uploaded"
            : uploadStatus === "exists"
            ? "✔ Already Exists"
            : uploadStatus === "error"
            ? "❌ Upload Failed. Try again or contact dev"
            : "Upload Events from File"}
        </button>

        <button
          onClick={async () => {
            const confirm = window.confirm("Delete ALL events?");
            if (!confirm) return;

            try {
              setDeleteStatus("deleting");
              await deleteAllEvents();
              await fetchEvents();
              setDeleteStatus("deleted");
              setTimeout(() => setDeleteStatus("idle"), RESET_DELAY);
            } catch (err) {
              console.error("❌ Error deleting all events:", err);
              setDeleteStatus("error");
            }
          }}
          className={`px-6 py-3 rounded-lg transition text-white ${
            deleteStatus === "deleted"
              ? "bg-green-600 hover:bg-green-700"
              : deleteStatus === "error"
              ? "bg-red-600"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {deleteStatus === "deleting"
            ? "Deleting..."
            : deleteStatus === "deleted"
            ? "✅ All Deleted"
            : deleteStatus === "error"
            ? "❌ Delete Failed. Try again or contact dev"
            : "Delete All Events"}
        </button>
      </div>
      {/* add new event */}
      <section className="w-full mt-12">
        <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);

            const newEvent = {
              title: formData.get("title") as string,
              date: formData.get("date") as string,
              time: formData.get("time") as string,
              location: formData.get("location") as string,
              image: formData.get("image") as string,
              category: formData.get("category") as string,
              description: formData.get("description") as string,
              lineup: (formData.get("lineup") as string).split(",").map((s) => s.trim()),
            };

            try {
              await addEvent(newEvent);
              alert("✅ Event added!");
              form.reset();
              await fetchEvents();
            } catch (err) {
              alert("❌ Failed to add event");
              console.error(err);
            }
          }}
          className="grid gap-4"
        >
          <input name="title" placeholder="Title" required className="px-4 py-2 rounded border" />
          <input name="date" type="date" required className="px-4 py-2 rounded border" />
          <input name="time" placeholder="Time (e.g. 19:00)" required className="px-4 py-2 rounded border" />
          <input name="location" placeholder="Location" required className="px-4 py-2 rounded border" />
          <input name="image" placeholder="Image URL" required className="px-4 py-2 rounded border" />
          <select name="category" defaultValue={CATEGORIES[0]} required className="px-4 py-2 rounded border">
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <textarea name="description" placeholder="Description" required className="px-4 py-2 rounded border" />
          <input name="lineup" placeholder="Lineup (comma-separated)" required className="px-4 py-2 rounded border" />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Event
          </button>
        </form>
      </section>

      {/* current events  */}

      <section className="w-full mt-12 max-h-[600px] overflow-y-auto pr-2">
        <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-white dark:bg-black z-10">Current Events</h2>
        <EventSearchBar
          data={events}
          onFilter={setFilteredEvents}
          keysToSearch={["title", "location", "category", "description", "lineup"]}
        />
        <ul className="space-y-4">
          {filteredEvents.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
          ) : (
            filteredEvents.map((event) => (
              <li
                key={event.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg shadow gap-4 border"
              >
                {editingEventId === event.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSave(event.id);
                    }}
                    className="w-full grid gap-2"
                  >
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      className="px-2 py-1 border rounded"
                      placeholder="Title"
                    />
                    <input
                      type="date"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                      className="px-2 py-1 border rounded"
                    />
                    <input
                      type="time"
                      value={editFormData.time}
                      onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                      className="px-2 py-1 border rounded"
                    />
                    <input
                      type="text"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      className="px-2 py-1 border rounded"
                      placeholder="Location"
                    />
                    <input
                      type="text"
                      value={editFormData.image}
                      onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                      className="px-2 py-1 border rounded"
                      placeholder="Image URL"
                    />
                    <select
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      className="px-2 py-1 border rounded"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <textarea
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      className="px-2 py-1 border rounded"
                      placeholder="Description"
                    />
                    <input
                      type="text"
                      value={editFormData.lineup}
                      onChange={(e) => setEditFormData({ ...editFormData, lineup: e.target.value })}
                      className="px-2 py-1 border rounded"
                      placeholder="Lineup (comma-separated)"
                    />
                    <div className="flex gap-2 mt-2">
                      <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingEventId(null)}
                        className="text-white px-4 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="text-left w-full">
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {event.date} at {event.time} • {event.location}
                      </p>
                      <p className="text-xs text-gray-600 italic mt-1">{event.description}</p>
                      <p className="text-xs text-purple-600 font-medium mt-1">
                        Lineup: {event.lineup?.join(", ") || "No lineup provided"}
                      </p>
                      <p className="text-xs text-purple-600 font-medium mt-1">Category: {event.category}</p>
                    </div>
                    <div className="flex gap-2 justify-end sm:w-auto">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-sm px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-sm px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}
