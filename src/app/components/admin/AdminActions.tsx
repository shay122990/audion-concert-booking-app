"use client";

type AdminActionsProps = {
  fetchEvents: () => Promise<void>;
  setUploadStatus: React.Dispatch<React.SetStateAction<"idle" | "uploading" | "uploaded" | "exists" | "error">>;
  setDeleteStatus: React.Dispatch<React.SetStateAction<"idle" | "deleting" | "deleted" | "error">>;
  uploadStatus: "idle" | "uploading" | "uploaded" | "exists" | "error";
  deleteStatus: "idle" | "deleting" | "deleted" | "error";
  addMockEvents: () => Promise<string>;
  deleteAllEvents: () => Promise<void>;
};

export default function AdminActions({
  fetchEvents,
  setUploadStatus,
  setDeleteStatus,
  uploadStatus,
  deleteStatus,
  addMockEvents,
  deleteAllEvents
}: AdminActionsProps) {
  const RESET_DELAY = 3000;

  const handleUpload = async () => {
    setUploadStatus("uploading");
    const result = await addMockEvents();
    await fetchEvents();

    if (result === "uploaded") {
      setUploadStatus("uploaded");
    } else if (result === "already-exists") {
      setUploadStatus("exists");
    } else {
      setUploadStatus("error");
    }
    setTimeout(() => setUploadStatus("idle"), RESET_DELAY);
  };

  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm("Delete ALL events?");
    if (!confirmDelete) return;

    try {
      setDeleteStatus("deleting");
      await deleteAllEvents();
      await fetchEvents();
      setDeleteStatus("deleted");
    } catch (err) {
      console.error("❌ Error deleting all events:", err);
      setDeleteStatus("error");
    }
    setTimeout(() => setDeleteStatus("idle"), RESET_DELAY);
  };

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      <button
        onClick={handleUpload}
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
          ? "❌ Upload Failed"
          : "Upload Events from File"}
      </button>

      <button
        onClick={handleDeleteAll}
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
          ? "❌ Delete Failed"
          : "Delete All Events"}
      </button>
    </div>
  );
}
