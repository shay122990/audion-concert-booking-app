"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {db,addMockEvents,deleteAllEvents,deleteEventById,addEvent,updateEventById,} from "@/app/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import EventSearchBar from "@/app/components/EventSearchBar";
import { Event } from "@/app/types/event";
import Image from "next/image";
import FormInput from "../components/form/FormInput";
import FormSelect from "../components/form/FormSelect";

const CATEGORIES = [
  "EDM", "Indie", "Pop", "Rock", "Jazz", "Classical",
  "R&B", "Local Events", "Festivals", "Underground", "Other"
];

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    dates: "",
    doorsOpenTime: "",
    startTime: "",
    endTime: "",
    location: "",
    image: "",
    category: "EDM",
    description: "",
    lineup: "",
    price: ""
  });
  const formFields = [
    { name: "title", placeholder: "Title" },
    { name: "dates", placeholder: "Dates (comma-separated)" },
    { name: "doorsOpenTime", placeholder: "Doors Open Time" },
    { name: "startTime", placeholder: "Start Time" },
    { name: "endTime", placeholder: "End Time" },
    { name: "location", placeholder: "Location" },
    { name: "image", placeholder: "Image URL" },
    { name: "description", placeholder: "Description", isTextArea: true },
    { name: "lineup", placeholder: "Lineup (comma-separated)" },
    { name: "price", placeholder: "Price (without a period or comma)" }
  ];
  
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
        dates: rawData.dates ?? [],
        doorsOpenTime: rawData.doorsOpenTime || "",
        startTime: rawData.startTime || "",
        endTime: rawData.endTime || "",
        location: rawData.location || "",
        image: rawData.image || "",
        category: rawData.category || "",
        description: rawData.description || "",
        lineup: Array.isArray(rawData.lineup) ? rawData.lineup : [],
        price: typeof rawData.price === "number" ? rawData.price : 0,
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
      dates: event.dates.join(", "),
      doorsOpenTime: event.doorsOpenTime,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      image: event.image ?? "",
      category: event.category,
      description: event.description,
      lineup: event.lineup?.join(", ") ?? "",
      price: event.price.toString()
    });
  };

  const handleSave = async (id: string) => {
    const original = events.find((e) => e.id === id);
    if (!original) return;

    const updated = {
      title: editFormData.title || original.title,
      dates: editFormData.dates.split(",").map((s) => s.trim()),
      doorsOpenTime: editFormData.doorsOpenTime || original.doorsOpenTime,
      startTime: editFormData.startTime || original.startTime,
      endTime: editFormData.endTime || original.endTime,
      location: editFormData.location || original.location,
      image: editFormData.image || original.image,
      category: editFormData.category || original.category,
      description: editFormData.description || original.description,
      lineup: editFormData.lineup
        ? editFormData.lineup.split(",").map((s) => s.trim())
        : original.lineup,
      price: Number(editFormData.price) || original.price
    };

    await updateEventById(id, updated);
    setEditingEventId(null);
    await fetchEvents();
  };

  const handleAddNewEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const newEvent: Event = {
      id: "",
      title: formData.get("title") as string,
      dates: (formData.get("dates") as string).split(",").map((s) => s.trim()),
      doorsOpenTime: formData.get("doorsOpenTime") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      location: formData.get("location") as string,
      image: formData.get("image") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      lineup: (formData.get("lineup") as string).split(",").map((s) => s.trim()),
      price: Number(formData.get("price")) || 0
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
      <section className="flex flex-col sm:flex-row items-center gap-6 mb-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl">
        <div className="w-28 h-28 relative rounded-full overflow-hidden">
          <Image
            src={user?.photoURL || "/shay250.png"}
            alt="Admin Profile Picture"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold">{user?.displayName || "Admin User"}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          <p className="text-xs text-purple-600 font-medium mt-2">Role: Administrator</p>
        </div>
      </section>

      {/* Upload & Delete Buttons */}
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

      {/* Add New Event Form */}
      <section className="w-full mt-12">
        <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
        <form onSubmit={handleAddNewEvent} className="grid gap-4">
          {formFields.map((field) => (
            <FormInput
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              isTextArea={field.isTextArea}
            />
          ))}
          <FormSelect name="category" options={CATEGORIES} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Add Event
          </button>
        </form>
      </section>

      {/* Current Events */}
      <section className="w-full mt-12">
        <h2 className="text-xl font-semibold mb-4">Current Events</h2>
        <div className="mb-6">
        <EventSearchBar<Event>
          data={events}
          onFilter={setFilteredEvents}
          keysToSearch={["title", "location", "category", "description", "lineup"]}
        />
        </div>
        <div className="max-h-[600px] overflow-y-auto pr-2">
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
                    <FormInput name="title" value={editFormData.title} placeholder="Title"
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    />
                    <FormInput name="dates" value={editFormData.dates} placeholder="Dates"
                      onChange={(e) => setEditFormData({ ...editFormData, dates: e.target.value })}
                    />
                    <FormSelect
                      name="category"
                      options={CATEGORIES}
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    />
                    <FormInput name="description" value={editFormData.description} placeholder="Description"
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      isTextArea
                    />
                    {/* Add other fields as needed */}
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
                        {event.dates.join(", ")} at {event.startTime} • {event.location}
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
      </div>  
      </section>
    </main>
  );
}
