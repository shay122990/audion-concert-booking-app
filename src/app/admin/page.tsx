"use client";

import { useEffect, useState,useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, addMockEvents, deleteAllEvents, deleteEventById, addEvent, updateEventById } from "@/app/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import EventSearchBar from "@/app/components/EventSearchBar";
import { Event } from "@/app/types/event";
import Image from "next/image";
import FormInput from "../components/admin/FormInput";
import FormSelect from "../components/admin/FormSelect";
import AdminActions from "../components/admin/AdminActions";
import ActionButton from "../components/admin/ActionButton";
import { buildEventFromFormData, parseCommaSeparatedString } from "@/app/utils/eventDataUtils";
import Modal from "../components/Modal";

const CATEGORIES = [
  "EDM", "Indie", "Pop", "Rock", "Jazz", "Classical",
  "R&B", "Local Events", "Festivals", "Underground", "Other"
];

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "", dates: "", doorsOpenTime: "", startTime: "", endTime: "",
    location: "", image: "", category: "EDM", description: "", lineup: "", price: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);
  const onConfirmRef = useRef<(() => void) | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "uploaded" | "exists" | "error">("idle");
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "deleting" | "deleted" | "error">("idle");
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const router = useRouter();

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
    { name: "price", placeholder: "Price" }
  ];

  useEffect(() => {
    if (!authLoading && !roleLoading && (!user || role !== "admin")) {
      router.push("/");
    }
  }, [user, role, authLoading, roleLoading, router]);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  useEffect(() => {
    if (user && role === "admin") fetchEvents();
  }, [user, role]);

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

  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = (id: string) => {
    onConfirmRef.current = async () => {
      await deleteEventById(id);
      await fetchEvents();
    };
  
    setModalTitle("Confirm Deletion");
    setModalContent(<p>Are you sure you want to delete this event?</p>);
    setModalFooter(
      <>
        <button
          onClick={async () => {
            if (onConfirmRef.current) {
              await onConfirmRef.current();
            }
            setIsModalOpen(false);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Confirm
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </>
    );
  
    setIsModalOpen(true);
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
    try {
      const original = events.find((e) => e.id === id);
      if (!original) return;
  
      const updated = {
        ...original,
        ...editFormData,
        dates: parseCommaSeparatedString(editFormData.dates),
        lineup: parseCommaSeparatedString(editFormData.lineup),
        price: Number(editFormData.price) || original.price
      };
  
      await updateEventById(id, updated);
      setEditingEventId(null);
      await fetchEvents();
  
      setModalTitle("Success");
      setModalContent(<p>✅ Event successfully updated!</p>);
      setModalFooter(
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          OK
        </button>
      );
      setIsModalOpen(true);
    } catch{
      setModalTitle("Error");
      setModalContent(<p>❌ Failed to update event. Please try again.</p>);
      setModalFooter(
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Retry
        </button>
      );
      setIsModalOpen(true);
    }
  };
  

  const handleAddNewEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
  
    const newEvent = buildEventFromFormData(formData);
  
    try {
      await addEvent(newEvent);
      form.reset();
      await fetchEvents();
  
      setModalTitle("Success");
      setModalContent(<p>✅ Event successfully created!</p>);
      setModalFooter(
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          OK
        </button>
      );
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setModalTitle("Error");
      setModalContent(<p>❌ Failed to create event. Please retry.</p>);
      setModalFooter(
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Retry
        </button>
      );
      setIsModalOpen(true);
    }
  };
  

  if (authLoading || roleLoading || !user) {
    return <p className="text-center py-12">Loading...</p>;
  }

  return (
    <main className="min-h-screen px-6 py-24 max-w-7xl mx-auto flex flex-col items-center text-center gap-6 border rounded my-10">
      <h1 className="text-3xl font-bold text-purple-600">Audion Admin</h1>
  
      {/* Admin Profile */}
      <section className="flex flex-col sm:flex-row items-center gap-6 mb-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl">
        <div className="w-28 h-28 relative rounded-full overflow-hidden">
          <Image src={user?.photoURL || "/shay250.png"} alt="Admin Profile Picture" fill className="object-cover" />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold">{user?.displayName || "Admin User"}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          <p className="text-xs text-purple-600 font-medium mt-2">Role: Administrator</p>
        </div>
      </section>
  
      {/* Upload & Delete */}
      <AdminActions
        fetchEvents={fetchEvents}
        setUploadStatus={setUploadStatus}
        setDeleteStatus={setDeleteStatus}
        uploadStatus={uploadStatus}
        deleteStatus={deleteStatus}
        addMockEvents={addMockEvents}
        deleteAllEvents={deleteAllEvents}
      />
  
      {/* Main Content Area: Add Event and Current Events side-by-side on desktop */}
      <section className="w-full flex flex-col lg:flex-row gap-12 mt-12">
        {/* Add New Event */}
        <div className="w-full lg:w-1/2">
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
            <ActionButton type="submit" label="Add Event" color="green" />
          </form>
        </div>
  
        {/* Current Events */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Current Events</h2>
          <EventSearchBar<Event>
            data={events}
            onFilter={setFilteredEvents}
            keysToSearch={["title", "location", "category", "description", "lineup"]}
          />
          <div className="max-h-[600px] overflow-y-auto pr-2 mt-6">
            <ul className="space-y-4">
              {filteredEvents.length === 0 ? (
                <p className="text-gray-500">No events found.</p>
              ) : (
                filteredEvents.map((event) => (
                  <li key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg shadow gap-4 border">
                    {editingEventId === event.id ? (
                      <form onSubmit={(e) => { e.preventDefault(); handleSave(event.id); }} className="w-full grid gap-2">
                        {formFields.map((field) => (
                          <FormInput
                            key={field.name}
                            name={field.name}
                            value={editFormData[field.name as keyof typeof editFormData]}
                            placeholder={field.placeholder}
                            isTextArea={field.isTextArea}
                            onChange={(e) => handleEditFormChange(field.name, e.target.value)}
                          />
                        ))}
                        <FormSelect
                          name="category"
                          options={CATEGORIES}
                          value={editFormData.category}
                          onChange={(e) => handleEditFormChange("category", e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                          <ActionButton type="submit" label="Save" color="green" />
                          <ActionButton label="Cancel" onClick={() => setEditingEventId(null)} color="gray" />
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
                          <ActionButton label="Edit" onClick={() => handleEdit(event)} color="blue" />
                          <ActionButton label="Delete" onClick={() => handleDelete(event.id)} color="red" />
                        </div>
                      </>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        footer={modalFooter}
      >
        {modalContent}
      </Modal>
    </main>
  );  
}
