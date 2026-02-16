// ============================================
// RAMADAN CHALLENGES TYPES
// ============================================

// --- Challenge Types ---
export type ChallengeType = "daily" | "progressive" | "milestone" | "special";
export type ChallengeCategory =
  | "quran"
  | "prayer"
  | "listening"
  | "reflection"
  | "community"
  | "charity";
export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ChallengeStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "failed";

// --- Badge Types ---
export type BadgeTier = "bronze" | "silver" | "gold" | "platinum" | "special";
export type BadgeRarity = "common" | "rare" | "epic" | "legendary";
export type BadgeCategory =
  | "streak"
  | "completion"
  | "mastery"
  | "community"
  | "special";

// --- Team Types ---
export type TeamRole = "creator" | "admin" | "member";
export type LeaderboardType = "global" | "friends" | "country";

// ============================================
// DATABASE MODELS
// ============================================

// --- Challenge Definition ---
export interface RamadanChallenge {
  id: string;
  challenge_key: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  challenge_type: ChallengeType;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  config: ChallengeConfig;
  xp_reward: number;
  badge_id: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  requires_challenges: string[] | null;
  icon: string | null;
  color: string | null;
  display_order: number;
  created_at: string;
}

// Challenge config examples
export interface ChallengeConfig {
  target?: number;
  unit?: string;
  daily?: boolean;
  time_range?: string;
  days_required?: number;
  min_pages?: number;
  nights?: number[];
  surah_numbers?: number[];
  [key: string]: unknown;
}

// --- User Challenge Progress ---
export interface UserRamadanChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  ramadan_year: number;
  status: ChallengeStatus;
  progress: ChallengeProgress;
  started_at: string | null;
  completed_at: string | null;
  last_updated_at: string;
  xp_earned: number;
  badge_earned: boolean;
}

// Progress tracking examples
export interface ChallengeProgress {
  current?: number;
  target?: number;
  days_completed?: number[];
  streak?: number;
  missed_days?: number;
  pages_read?: number;
  minutes_listened?: number;
  reflections_count?: number;
  favorite_surahs_read?: number[];
  [key: string]: unknown;
}

// --- Daily Log ---
export interface RamadanDailyLog {
  id: string;
  user_id: string;
  challenge_id: string;
  ramadan_year: number;
  ramadan_day: number;
  date: string;
  completed: boolean;
  progress_data: DailyProgressData | null;
  completed_at: string | null;
  created_at: string;
}

export interface DailyProgressData {
  juz_completed?: number;
  pages_read?: number;
  minutes_listened?: number;
  prayer_time?: string;
  on_time?: boolean;
  reflection_written?: boolean;
  reading_time_seconds?: number; // Time spent reading
  ayahs_read?: number; // Total ayahs read
  average_reading_speed?: number; // Pages per minute
  [key: string]: unknown;
}

// --- Badges ---
export interface Badge {
  id: string;
  badge_key: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  icon: string;
  color: string;
  tier: BadgeTier;
  category: BadgeCategory;
  rarity: BadgeRarity;
  created_at: string;
}

// --- User Badges ---
export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_from_challenge_id: string | null;
  ramadan_year: number | null;
  is_showcased: boolean;
  earned_at: string;
}

// --- User Ramadan Profile ---
export interface UserRamadanProfile {
  user_id: string;
  ramadan_year: number;
  total_xp: number;
  level: number;
  challenges_completed: number;
  challenges_in_progress: number;
  badges_earned: number;
  selected_difficulty: ChallengeDifficulty | null;
  daily_goal_minutes: number | null;
  daily_goal_pages: number | null;
  pages_read_today?: number; // Today's page count for progress indicator
  last_activity_date: string | null;
  ramadan_streak: number;
  created_at: string;
  updated_at: string;
}

// --- Leaderboard ---
export interface RamadanLeaderboard {
  id: string;
  ramadan_year: number;
  leaderboard_type: LeaderboardType;
  scope_value: string | null;
  user_id: string;
  rank: number;
  total_xp: number;
  challenges_completed: number;
  ramadan_streak: number;
  computed_at: string;
}

// --- Reflections / Journal ---
export interface RamadanReflection {
  id: string;
  user_id: string;
  ramadan_year: number;
  ramadan_day: number;
  date: string;
  reflection_text: string;
  surah_number: number | null;
  ayah_number: number | null;
  is_private: boolean;
  word_count: number | null;
  created_at: string;
  updated_at: string;
}

// --- Teams ---
export interface RamadanTeam {
  id: string;
  team_name: string;
  team_code: string;
  creator_id: string;
  ramadan_year: number;
  max_members: number;
  is_private: boolean;
  total_xp: number;
  total_challenges_completed: number;
  member_count: number;
  created_at: string;
}

// --- Team Members ---
export interface RamadanTeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  xp_contributed: number;
  challenges_contributed: number;
  joined_at: string;
}

// ============================================
// EXTENDED TYPES (WITH JOINS)
// ============================================

// User challenge with challenge details
export interface UserChallengeWithDetails extends UserRamadanChallenge {
  challenge: RamadanChallenge;
}

// User badge with badge details
export interface UserBadgeWithDetails extends UserBadge {
  badge: Badge;
}

// Leaderboard entry with user profile
export interface LeaderboardEntryWithProfile extends RamadanLeaderboard {
  profile: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

// Team with members
export interface TeamWithMembers extends RamadanTeam {
  members: RamadanTeamMember[];
}

// ============================================
// REQUEST/RESPONSE TYPES
// ============================================

// Enroll in challenge
export interface EnrollChallengeRequest {
  user_id: string;
  challenge_id: string;
  ramadan_year: number;
}

// Update challenge progress
export interface UpdateChallengeProgressRequest {
  user_id: string;
  challenge_id: string;
  ramadan_year: number;
  progress: Partial<ChallengeProgress>;
  status?: ChallengeStatus;
}

// Create reflection
export interface CreateReflectionRequest {
  user_id: string;
  ramadan_year: number;
  ramadan_day: number;
  date: string;
  reflection_text: string;
  surah_number?: number;
  ayah_number?: number;
  is_private?: boolean;
}

// Create team
export interface CreateTeamRequest {
  team_name: string;
  creator_id: string;
  ramadan_year: number;
  max_members?: number;
  is_private?: boolean;
}

// Join team
export interface JoinTeamRequest {
  team_code: string;
  user_id: string;
}

// ============================================
// COMPUTED/DERIVED TYPES
// ============================================

// Challenge statistics
export interface ChallengeStatistics {
  total_challenges: number;
  completed_challenges: number;
  in_progress_challenges: number;
  completion_rate: number;
  total_xp: number;
  current_level: number;
  next_level_xp: number;
}

// Daily summary
export interface DailySummary {
  date: string;
  ramadan_day: number;
  challenges_completed: number;
  xp_earned: number;
  pages_read: number;
  minutes_listened: number;
  reflection_written: boolean;
}

// Weekly summary
export interface WeeklySummary {
  week_number: number;
  start_date: string;
  end_date: string;
  total_xp: number;
  challenges_completed: number;
  streak_maintained: boolean;
  badges_earned: number;
}

// Overall Ramadan stats
export interface RamadanStats {
  ramadan_year: number;
  total_xp: number;
  level: number;
  total_challenges_completed: number;
  total_badges_earned: number;
  longest_streak: number;
  current_streak: number;
  total_pages_read: number;
  total_minutes_listened: number;
  total_reflections: number;
  completion_percentage: number;
}
