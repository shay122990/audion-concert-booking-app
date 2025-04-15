import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        setRole(data.role === "admin" ? "admin" : "user");
      } else {
        setRole("user");
      }

      setLoading(false);
    };

    fetchRole();
  }, [user]);

  return { role, loading };
}
