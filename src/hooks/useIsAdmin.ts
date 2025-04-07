import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return setLoading(false);

      const q = query(collection(db, "admins"), where("email", "==", user.email));
      const snapshot = await getDocs(q);

      setIsAdmin(!snapshot.empty);
      setLoading(false);
    };

    checkAdmin();
  }, [user]);

  return { isAdmin, loading };
}
