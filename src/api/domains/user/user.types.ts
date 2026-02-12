export interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

export interface FavoriteReciter {
  id: number;
  user_id: string;
  reciter_id: number;
  reciter_name: string | null;
  reciter_name_english?: string | null;
  created_at: string;
}

export interface FavoriteSurah {
  id: number;
  user_id: string;
  surah_number: number;
  reciter_id?: number | null;
  reciter_name?: string | null;
  reciter_name_english?: string | null;
  created_at: string;
}

export interface FavoriteAyah {
  id: string;
  user_id: string;
  surah_number: number;
  ayah_number: number;
  surah_name: string | null;
  ayah_text: string | null;
  surah_name_english: string | null;
  created_at: string;
}

export interface UserProgress {
  id: number;
  user_id: string;
  date: string;
  minutes_listened: number;
  pages_read: number;
  updated_at: string;
}

export interface UserStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  updated_at: string;
}

export interface UserGoal {
  id: number;
  user_id: string;
  target_type: "minutes" | "pages";
  target_value: number;
  period: "daily" | "weekly";
  created_at: string;
}
