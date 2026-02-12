import supabase from "@/lib/supabase-client";
import type {
  FavoriteReciter,
  FavoriteSurah,
  FavoriteAyah,
  Profile,
  UserGoal,
  UserProgress,
  UserStreak,
} from "./user.types";

// --- Profiles ---
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};

export const updateProfile = async (
  userId: string,
  updates: Partial<Profile>,
): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// --- Favorites ---
export const getFavoriteReciters = async (
  userId: string,
): Promise<FavoriteReciter[]> => {
  const { data, error } = await supabase
    .from("favorite_reciters")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data || [];
};

export const addFavoriteReciter = async (
  userId: string,
  reciterId: number,
  reciterName?: string,
  reciterNameEnglish?: string,
): Promise<FavoriteReciter | null> => {
  const { data, error } = await supabase
    .from("favorite_reciters")
    .insert([
      {
        user_id: userId,
        reciter_id: reciterId,
        reciter_name: reciterName,
        reciter_name_english: reciterNameEnglish,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const removeFavoriteReciter = async (
  userId: string,
  reciterId: number,
): Promise<void> => {
  const { error } = await supabase
    .from("favorite_reciters")
    .delete()
    .match({ user_id: userId, reciter_id: reciterId });
  if (error) throw error;
};

export const getFavoriteSurahs = async (
  userId: string,
): Promise<FavoriteSurah[]> => {
  const { data, error } = await supabase
    .from("favorite_surahs")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data || [];
};

export const addFavoriteSurah = async (
  userId: string,
  surahNumber: number,
  reciterId?: number,
  reciterName?: string,
  reciterNameEnglish?: string,
): Promise<FavoriteSurah | null> => {
  const { data, error } = await supabase
    .from("favorite_surahs")
    .insert([
      {
        user_id: userId,
        surah_number: surahNumber,
        reciter_id: reciterId,
        reciter_name: reciterName,
        reciter_name_english: reciterNameEnglish,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const removeFavoriteSurah = async (
  userId: string,
  surahNumber: number,
  reciterId?: number,
): Promise<void> => {
  let query = supabase
    .from("favorite_surahs")
    .delete()
    .eq("user_id", userId)
    .eq("surah_number", surahNumber);

  if (reciterId) {
    query = query.eq("reciter_id", reciterId);
  } else {
    query = query.is("reciter_id", null);
  }
  const { error } = await query;
  if (error) throw error;
};

export const getFavoriteAyahs = async (
  userId: string,
): Promise<FavoriteAyah[]> => {
  const { data, error } = await supabase
    .from("favorite_ayahs")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data || [];
};

export const addFavoriteAyah = async (
  userId: string,
  surahNumber: number,
  ayahNumber: number,
  surahName?: string,
  ayahText?: string,
  surahNameEnglish?: string,
): Promise<FavoriteAyah | null> => {
  const { data, error } = await supabase
    .from("favorite_ayahs")
    .insert([
      {
        user_id: userId,
        surah_number: surahNumber,
        ayah_number: ayahNumber,
        surah_name: surahName,
        ayah_text: ayahText,
        surah_name_english: surahNameEnglish,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const removeFavoriteAyah = async (
  userId: string,
  surahNumber: number,
  ayahNumber: number,
): Promise<void> => {
  const { error } = await supabase.from("favorite_ayahs").delete().match({
    user_id: userId,
    surah_number: surahNumber,
    ayah_number: ayahNumber,
  });
  if (error) throw error;
};

// --- Progress & Streaks ---
// --- Progress & Streaks ---
export const getUserProgress = async (
  userId: string,
  date?: string,
): Promise<UserProgress[]> => {
  let query = supabase.from("daily_progress").select("*").eq("user_id", userId);

  if (date) {
    query = query.eq("date", date);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

// Re-implementing simplified progress update
export const updateDailyProgress = async (
  userId: string,
  progress: Partial<UserProgress>,
): Promise<UserProgress | null> => {
  // Upsert logic usually
  // We need 'date' to be present if upserting
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("daily_progress")
    .upsert(
      { user_id: userId, date: today, ...progress },
      { onConflict: "user_id, date" },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getUserStreaks = async (
  userId: string,
): Promise<UserStreak | null> => {
  const { data, error } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 is "The result contains 0 rows"
  return data;
};

// --- Goals ---
export const getUserGoals = async (userId: string): Promise<UserGoal[]> => {
  const { data, error } = await supabase
    .from("user_goals")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data || [];
};

export const addUserGoal = async (
  goal: Omit<UserGoal, "id" | "created_at">,
): Promise<UserGoal | null> => {
  const { data, error } = await supabase
    .from("user_goals")
    .insert([goal])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteUserGoal = async (id: number): Promise<void> => {
  const { error } = await supabase.from("user_goals").delete().eq("id", id);
  if (error) throw error;
};
