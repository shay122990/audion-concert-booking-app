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

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  image?: string;
};

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    date: "",
    location: "",
    image: "",
  });

  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Event, "id">),
    }));
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
      location: event.location,
      image: event.image ?? "",
    });
  };

  const handleSave = async (id: string) => {
    const original = events.find((e) => e.id === id);
    if (!original) return;

    const updated = {
      title: editFormData.title || original.title,
      date: editFormData.date || original.date,
      location: editFormData.location || original.location,
      image: editFormData.image || original.image,
    };

    await updateEventById(id, updated);
    setEditingEventId(null);
    await fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen px-6 py-24 max-w-3xl mx-auto flex flex-col items-center text-center gap-6 border rounded my-10">
      <h1 className="text-3xl font-bold text-purple-600">Audion Admin</h1>

      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={addMockEvents}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Upload Events from File
        </button>
        <button
          onClick={async () => {
            const confirm = window.confirm("Delete ALL events?");
            if (!confirm) return;
            await deleteAllEvents();
            await fetchEvents();
          }}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete All Events
        </button>
      </div>

      {/* Add New Event Form */}
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
              location: formData.get("location") as string,
              image: formData.get("image") as string,
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
          <input name="location" placeholder="Location" required className="px-4 py-2 rounded border" />
          <input name="image" placeholder="Image URL" required className="px-4 py-2 rounded border" />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Event
          </button>
        </form>
      </section>

      <section className="w-full mt-12">
        <h2 className="text-xl font-semibold mb-4">Current Events</h2>
        <ul className="space-y-4">
          {events.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
          ) : (
            events.map((event) => (
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
                    <div className="flex gap-2 mt-2">
                      <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingEventId(null)}
                        className=" text-white px-4 py-1 rounded hover:bg-gray-500"
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
                        {event.date} • {event.location}
                      </p>
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
