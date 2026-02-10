"use client";

/* 
  Admin page for managing events.
  Includes:
  - Add new event form
  - Edit & delete event functionality
  - Upload mock events
  - Delete all events
  - Role-protected admin access
*/

import { useEffect, useState, useRef } from "react";
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
import EventSearchBar from "@/app/components/EventSearchBar";
import { Event } from "@/app/types/event";
import FormInput from "./components/FormInput";
import FormSelect from "./components/FormSelect";
import AdminActions from "./components/AdminActions";
import ActionButton from "./components/ActionButton";
import {
  buildEventFromFormData,
  parseCommaSeparatedString,
} from "@/app/utils/eventDataUtils";
import Modal from "../components/Modal";
import UserCard from "@/app/components/UserCard";

/* Categories used for dropdown */
const CATEGORIES = [
  "EDM",
  "Indie",
  "Pop",
  "Rock",
  "Jazz",
  "Classical",
  "R&B",
  "Local Events",
  "Festivals",
  "Underground",
  "Other",
];

/* All form fields, now with clear placeholders and types */
const formFields = [
  { name: "title", placeholder: "Event Title", type: "text" },
  { name: "dates", placeholder: "Event Date", type: "date" },
  { name: "doorsOpenTime", placeholder: "Doors Open Time" },
  { name: "startTime", placeholder: "Start Time" },
  { name: "endTime", placeholder: "End Time" },
  { name: "location", placeholder: "Location", type: "text" },
  { name: "image", placeholder: "Image URL", type: "text" },
  { name: "description", placeholder: "Description", isTextArea: true },
  { name: "lineup", placeholder: "Lineup (comma-separated)", type: "text" },
  { name: "price", placeholder: "Ticket Price", type: "number" },
];

/* Helper — identifies fields that need time dropdowns */
const isTimeField = (name: string) =>
  name === "doorsOpenTime" || name === "startTime" || name === "endTime";

/* Generates time list (00:00 → 23:45) at 15-minute intervals */
const TIME_OPTIONS: string[] = Array.from({ length: 96 }, (_, i) => {
  const hour = String(Math.floor(i / 4)).padStart(2, "0");
  const minute = String((i % 4) * 15).padStart(2, "0");
  return `${hour}:${minute}`;
});

export default function AdminPage() {
  /* State for events in Firestore */
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  /* Editable form state */
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
    price: "",
  });

  /* Modal state */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);
  const onConfirmRef = useRef<(() => void) | null>(null);

  /* Upload & delete UI status */
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "uploaded" | "exists" | "error"
  >("idle");
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "deleting" | "deleted" | "error"
  >("idle");

  /* Auth + role handling */
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useAuth();
  const router = useRouter();

  /* Role-protect admin page */
  useEffect(() => {
    if (!authLoading && !roleLoading && (!user || role !== "admin")) {
      router.push("/admin");
    }
  }, [user, role, authLoading, roleLoading, router]);

  /* Sync display list */
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  /* Fetch events from Firestore */
  useEffect(() => {
    if (user && role === "admin") fetchEvents();
  }, [user, role]);

  /* Load events from Firestore */
  const fetchEvents = async () => {
    const snapshot = await getDocs(collection(db, "events"));

    const data: Event[] = snapshot.docs.map((doc) => {
      const raw = doc.data() as Partial<Event>;
      return {
        id: doc.id,
        title: raw.title || "",
        dates: raw.dates ?? [],
        doorsOpenTime: raw.doorsOpenTime || "",
        startTime: raw.startTime || "",
        endTime: raw.endTime || "",
        location: raw.location || "",
        image: raw.image || "",
        category: raw.category || "",
        description: raw.description || "",
        lineup: Array.isArray(raw.lineup) ? raw.lineup : [],
        price: typeof raw.price === "number" ? raw.price : 0,
      };
    });

    setEvents(data);
  };

  /* Edit event form handler */
  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* Delete event with confirmation modal */
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
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={async () => {
            if (onConfirmRef.current) await onConfirmRef.current();
            setIsModalOpen(false);
          }}
        >
          Confirm
        </button>
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded"
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </button>
      </>,
    );
    setIsModalOpen(true);
  };

  /* Load event data into edit mode */
  const handleEdit = (event: Event) => {
    setEditingEventId(event.id);
    setEditFormData({
      title: event.title,
      dates: event.dates[0] ?? "",
      doorsOpenTime: event.doorsOpenTime,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      image: event.image ?? "",
      category: event.category,
      description: event.description,
      lineup: event.lineup?.join(", ") ?? "",
      price: event.price.toString(),
    });
  };

  /* Save edited event back to Firestore */
  const handleSave = async (id: string) => {
    try {
      const original = events.find((e) => e.id === id);
      if (!original) return;

      const updated = {
        ...original,
        ...editFormData,
        dates: parseCommaSeparatedString(editFormData.dates),
        lineup: parseCommaSeparatedString(editFormData.lineup),
        price: Number(editFormData.price),
      };

      await updateEventById(id, updated);
      setEditingEventId(null);
      fetchEvents();

      setModalTitle("Success");
      setModalContent(<p>Event updated successfully.</p>);
      setModalFooter(
        <button
          className="bg-green-500 px-4 py-2 text-white rounded"
          onClick={() => setIsModalOpen(false)}
        >
          OK
        </button>,
      );
      setIsModalOpen(true);
    } catch {
      setModalTitle("Error");
      setModalContent(<p>Failed to update event.</p>);
      setModalFooter(
        <button
          className="bg-red-500 px-4 py-2 text-white rounded"
          onClick={() => setIsModalOpen(false)}
        >
          Retry
        </button>,
      );
      setIsModalOpen(true);
    }
  };

  /* Add brand new event */
  const handleAddNewEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const newEvent = buildEventFromFormData(formData);

    try {
      await addEvent(newEvent);
      form.reset();
      fetchEvents();

      setModalTitle("Success");
      setModalContent(<p>Event created successfully.</p>);
      setModalFooter(
        <button
          className="bg-green-500 px-4 py-2 text-white rounded"
          onClick={() => setIsModalOpen(false)}
        >
          OK
        </button>,
      );
      setIsModalOpen(true);
    } catch {
      setModalTitle("Error");
      setModalContent(<p>Failed to create event.</p>);
      setModalFooter(
        <button
          className="bg-red-500 px-4 py-2 text-white rounded"
          onClick={() => setIsModalOpen(false)}
        >
          Retry
        </button>,
      );
      setIsModalOpen(true);
    }
  };

  /* Loading state before user & role are known */
  if (authLoading || roleLoading || !user) {
    return <p className="text-center py-12">Loading...</p>;
  }

  /* MAIN RENDER */
  return (
    <main className="min-h-screen px-6 py-8 max-w-7xl mx-auto flex flex-col items-center text-center gap-6 border rounded my-10 mt-24">
      {/* Admin Title + Back Button */}
      <h1 className="text-3xl font-bold text-purple-600">Audion Admin</h1>
      <button
        onClick={() => router.push("/profile")}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Go to Profile
      </button>

      {/* Admin Header Card */}
      <UserCard
        variant="admin"
        displayName={user?.displayName}
        email={user?.email}
        photoURL={user?.photoURL}
        roleLabel="Administrator"
      />

      {/* Quick Upload / Delete buttons */}
      <AdminActions
        fetchEvents={fetchEvents}
        setUploadStatus={setUploadStatus}
        setDeleteStatus={setDeleteStatus}
        uploadStatus={uploadStatus}
        deleteStatus={deleteStatus}
        addMockEvents={addMockEvents}
        deleteAllEvents={deleteAllEvents}
        setModalTitle={setModalTitle}
        setModalContent={setModalContent}
        setModalFooter={setModalFooter}
        setIsModalOpen={setIsModalOpen}
      />

      <section className="w-full flex flex-col lg:flex-row gap-12 mt-12">
        {/* ADD NEW EVENT FORM */}
        <div className="w-full lg:w-1/2 text-left">
          <h2 className="text-xl font-semibold mb-4">Add New Event</h2>

          <form onSubmit={handleAddNewEvent} className="grid gap-4">
            {formFields.map((field) => {
              if (isTimeField(field.name)) {
                return (
                  <label
                    key={field.name}
                    className="flex flex-col text-sm font-medium text-white"
                  >
                    {field.placeholder}
                    <FormSelect name={field.name} options={TIME_OPTIONS} />
                  </label>
                );
              }

              if (field.name === "dates") {
                return (
                  <label
                    key={field.name}
                    className="flex flex-col text-sm font-medium text-white"
                  >
                    {field.placeholder}
                    <FormInput name={field.name} type="date" />
                  </label>
                );
              }

              return (
                <label
                  key={field.name}
                  className="flex flex-col text-sm font-medium text-white"
                >
                  {field.placeholder}
                  <FormInput
                    name={field.name}
                    placeholder={field.placeholder}
                    isTextArea={field.isTextArea}
                    type={field.type}
                  />
                </label>
              );
            })}

            <label className="flex flex-col text-sm font-medium text-white">
              Category
              <FormSelect name="category" options={CATEGORIES} />
            </label>

            <ActionButton type="submit" label="Add Event" color="green" />
          </form>
        </div>

        {/* EXISTING EVENTS LIST */}
        <div className="w-full lg:w-1/2 text-left">
          <h2 className="text-xl font-semibold mb-4">Current Events</h2>

          <EventSearchBar<Event>
            data={events}
            onFilter={setFilteredEvents}
            keysToSearch={[
              "title",
              "location",
              "category",
              "description",
              "lineup",
            ]}
          />

          <div className="max-h-[750px] overflow-y-auto pr-2 mt-6">
            <ul className="space-y-4">
              {filteredEvents.length === 0 && (
                <p className="text-gray-500">No events found.</p>
              )}

              {filteredEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg shadow border gap-4"
                >
                  {/* EDIT MODE */}
                  {editingEventId === event.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSave(event.id);
                      }}
                      className="w-full grid gap-3"
                    >
                      {formFields.map((field) => {
                        if (isTimeField(field.name)) {
                          return (
                            <label
                              key={field.name}
                              className="flex flex-col text-sm font-medium text-white"
                            >
                              {field.placeholder}
                              <FormSelect
                                name={field.name}
                                options={TIME_OPTIONS}
                                value={
                                  editFormData[
                                    field.name as keyof typeof editFormData
                                  ]
                                }
                                onChange={(e) =>
                                  handleEditFormChange(
                                    field.name,
                                    e.target.value,
                                  )
                                }
                              />
                            </label>
                          );
                        }

                        if (field.name === "dates") {
                          return (
                            <label
                              key={field.name}
                              className="flex flex-col text-sm font-medium text-white"
                            >
                              {field.placeholder}
                              <FormInput
                                name={field.name}
                                type="date"
                                value={editFormData.dates}
                                onChange={(e) =>
                                  handleEditFormChange("dates", e.target.value)
                                }
                              />
                            </label>
                          );
                        }

                        return (
                          <label
                            key={field.name}
                            className="flex flex-col text-sm font-medium text-white"
                          >
                            {field.placeholder}
                            <FormInput
                              name={field.name}
                              type={field.type}
                              value={
                                editFormData[
                                  field.name as keyof typeof editFormData
                                ]
                              }
                              placeholder={field.placeholder}
                              isTextArea={field.isTextArea}
                              onChange={(e) =>
                                handleEditFormChange(field.name, e.target.value)
                              }
                            />
                          </label>
                        );
                      })}

                      <label className="flex flex-col text-sm font-medium text-white">
                        Category
                        <FormSelect
                          name="category"
                          options={CATEGORIES}
                          value={editFormData.category}
                          onChange={(e) =>
                            handleEditFormChange("category", e.target.value)
                          }
                        />
                      </label>

                      <div className="flex gap-2 mt-2">
                        <ActionButton
                          type="submit"
                          label="Save"
                          color="green"
                        />
                        <ActionButton
                          label="Cancel"
                          onClick={() => setEditingEventId(null)}
                          color="gray"
                        />
                      </div>
                    </form>
                  ) : (
                    <>
                      {/* READ VIEW */}
                      <div className="text-left w-full">
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-sm text-gray-500">
                          {event.dates.join(", ")} at {event.startTime} ·{" "}
                          {event.location}
                        </p>
                        <p className="text-xs text-gray-600 italic mt-1">
                          {event.description}
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                          Lineup:{" "}
                          {event.lineup?.join(", ") || "No lineup provided"}
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                          Category: {event.category}
                        </p>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <ActionButton
                          label="Edit"
                          onClick={() => handleEdit(event)}
                          color="blue"
                        />
                        <ActionButton
                          label="Delete"
                          onClick={() => handleDelete(event.id)}
                          color="red"
                        />
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Shared Modal */}
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
