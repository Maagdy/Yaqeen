import { useEffect, useState, type ReactNode } from "react";
import supabase from "@/lib/supabase-client";
import type { User, Session } from "@supabase/supabase-js";
import { getProfile } from "@/api/domains/user";
import type { Profile } from "@/api/domains/user";
import { AuthContext } from "@/contexts/auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
  }, []);

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
