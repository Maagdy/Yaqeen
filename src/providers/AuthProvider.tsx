import { useEffect, useState, useCallback, type ReactNode } from "react";
import supabase from "@/lib/supabase-client";
import type { User, Session } from "@supabase/supabase-js";
import { getProfile } from "@/api/domains/user";
import type { Profile } from "@/api/domains/user";
import { AuthContext } from "@/contexts/auth-context";
import { SyncQueueService } from "@/services/sync-queue-service";
import { executeSyncItem } from "@/services/sync-executor";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const drainQueue = useCallback(async (userId: string) => {
    if (!navigator.onLine) return;
    try {
      await SyncQueueService.drain(userId, executeSyncItem);
    } catch (error) {
      console.error("[AuthProvider] Sync drain failed:", error);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      const valid = !!(
        session?.user &&
        session &&
        (session.expires_at ? session.expires_at > Date.now() / 1000 : true)
      );
      setIsLoggedIn(valid);

      if (session?.user) {
        getProfile(session.user.id).then(setProfile);
        // Drain any offline-queued writes on app mount
        drainQueue(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      const valid = !!(
        session?.user &&
        session &&
        (session.expires_at ? session.expires_at > Date.now() / 1000 : true)
      );
      setIsLoggedIn(valid);

      if (session?.user) {
        getProfile(session.user.id).then(setProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [drainQueue]);

  // Drain queue when the browser comes back online
  useEffect(() => {
    if (!user) return;

    const handleOnline = () => drainQueue(user.id);
    const handleDrainMsg = () => drainQueue(user.id);

    window.addEventListener("online", handleOnline);
    window.addEventListener("yaqeen-drain-sync", handleDrainMsg);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("yaqeen-drain-sync", handleDrainMsg);
    };
  }, [user, drainQueue]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    setSession(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, profile, loading, isLoggedIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
