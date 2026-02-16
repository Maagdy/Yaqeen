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

export interface FavoriteJuz {
  id: number;
  user_id: string;
  juz_number: number;
  created_at: string;
}

export interface UserProgress {
  id: number;
  user_id: string;
  date: string;
  minutes_listened: number;
  pages_read: number;
  reading_time_seconds?: number; // Time spent reading (analytics)
  ayahs_read?: number; // Total ayahs read (analytics)
  average_reading_speed?: number; // Pages per minute (analytics)
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

export interface FavoriteBook {
  id: string;
  user_id: string;
  collection_name: string;
  book_number?: string;
  book_name?: string;
  created_at: string;
}

export interface FavoriteHadith {
  id: string;
  user_id: string;
  collection_name: string;
  book_number: string;
  hadith_number: string;
  chapter_id?: string;
  hadith_text?: string;
  created_at: string;
}

export interface FavoriteMushaf {
  id: number;
  user_id: string;
  mushaf_id: number;
  mushaf_name?: string | null;
  mushaf_name_english?: string | null;
  created_at: string;
}

export interface FavoriteRadio {
  id: number;
  user_id: string;
  radio_id: number;
  radio_name?: string | null;
  radio_name_english?: string | null;
  radio_url?: string | null;
  created_at: string;
}

export interface FavoriteDua {
  id: string;
  user_id: string;
  dua_id: number;
  dua_category: string;
  dua_text_arabic?: string;
  dua_text_english?: string;
  dua_reference?: string;
  created_at: string;
}
