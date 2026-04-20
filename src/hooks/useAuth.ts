import { useEffect, useState } from "react";
import { getCurrentUser, isAuthenticated, type AuthUser } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [authed, setAuthed] = useState<boolean>(() => isAuthenticated());

  useEffect(() => {
    const sync = () => {
      setUser(getCurrentUser());
      setAuthed(isAuthenticated());
    };
    window.addEventListener("auth-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { user, isAuthenticated: authed };
}
