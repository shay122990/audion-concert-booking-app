"use client";

type AdminActionsProps = {
  fetchEvents: () => Promise<void>;
  setUploadStatus: React.Dispatch<React.SetStateAction<"idle" | "uploading" | "uploaded" | "exists" | "error">>;
  setDeleteStatus: React.Dispatch<React.SetStateAction<"idle" | "deleting" | "deleted" | "error">>;
  uploadStatus: "idle" | "uploading" | "uploaded" | "exists" | "error";
  deleteStatus: "idle" | "deleting" | "deleted" | "error";
  addMockEvents: () => Promise<string>;
  deleteAllEvents: () => Promise<void>;
  setModalTitle: React.Dispatch<React.SetStateAction<string>>;
  setModalContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setModalFooter: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AdminActions({
  fetchEvents,
  setUploadStatus,
  setDeleteStatus,
  uploadStatus,
  deleteStatus,
  addMockEvents,
  deleteAllEvents,
  setModalTitle,
  setModalContent,
  setModalFooter,
  setIsModalOpen,
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

  const handleDeleteAll = () => {
    setModalTitle("Confirm Deletion");
    setModalContent(<p>Are you sure you want to delete all events?</p>);
    setModalFooter(
      <>
        <button
          onClick={async () => {
            setDeleteStatus("deleting");
            try {
              await deleteAllEvents();
              await fetchEvents();
              setDeleteStatus("deleted");
            } catch (err) {
              console.error("❌ Error deleting all events:", err);
              setDeleteStatus("error");
            }
            setIsModalOpen(false);
            setTimeout(() => setDeleteStatus("idle"), RESET_DELAY);
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
