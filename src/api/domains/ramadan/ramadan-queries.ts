import supabase from "@/lib/supabase-client";
import type {
  RamadanChallenge,
  UserRamadanChallenge,
  RamadanDailyLog,
  Badge,
  UserBadge,
  UserRamadanProfile,
  RamadanLeaderboard,
  RamadanReflection,
  RamadanTeam,
  RamadanTeamMember,
  UserChallengeWithDetails,
  UserBadgeWithDetails,
  EnrollChallengeRequest,
  UpdateChallengeProgressRequest,
  CreateReflectionRequest,
  CreateTeamRequest,
  JoinTeamRequest,
  ChallengeProgress,
  ChallengeStatus,
} from "./ramadan.types";

// ============================================
// CHALLENGES
// ============================================

export const getAllChallenges = async (): Promise<RamadanChallenge[]> => {
  const { data, error } = await supabase
    .from("ramadan_challenges")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) throw error;
  return data || [];
};

export const getChallengesByCategory = async (
  category: string,
): Promise<RamadanChallenge[]> => {
  const { data, error } = await supabase
    .from("ramadan_challenges")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .order("display_order");

  if (error) throw error;
  return data || [];
};

export const getChallengesByDifficulty = async (
  difficulty: string,
): Promise<RamadanChallenge[]> => {
  const { data, error } = await supabase
    .from("ramadan_challenges")
    .select("*")
    .eq("difficulty", difficulty)
    .eq("is_active", true)
    .order("display_order");

  if (error) throw error;
  return data || [];
};

export const getChallengeById = async (
  challengeId: string,
): Promise<RamadanChallenge | null> => {
  const { data, error } = await supabase
    .from("ramadan_challenges")
    .select("*")
    .eq("id", challengeId)
    .single();

  if (error) throw error;
  return data;
};

// ============================================
// USER CHALLENGES
// ============================================

export const getUserChallenges = async (
  userId: string,
  ramadanYear: number,
): Promise<UserChallengeWithDetails[]> => {
  const { data, error } = await supabase
    .from("user_ramadan_challenges")
    .select(
      `
      *,
      challenge:ramadan_challenges(*)
    `,
    )
    .eq("user_id", userId)
    .eq("ramadan_year", ramadanYear);

  if (error) throw error;
  return data || [];
};

export const getUserChallengesByStatus = async (
  userId: string,
  ramadanYear: number,
  status: ChallengeStatus,
): Promise<UserChallengeWithDetails[]> => {
  const { data, error } = await supabase
    .from("user_ramadan_challenges")
    .select(
      `
      *,
      challenge:ramadan_challenges(*)
    `,
    )
    .eq("user_id", userId)
    .eq("ramadan_year", ramadanYear)
    .eq("status", status);

  if (error) throw error;
  return data || [];
};

export const enrollInChallenge = async (
  request: EnrollChallengeRequest,
): Promise<UserRamadanChallenge | null> => {
  const { data, error } = await supabase
    .from("user_ramadan_challenges")
    .insert([
      {
        user_id: request.user_id,
        challenge_id: request.challenge_id,
        ramadan_year: request.ramadan_year,
        status: "in_progress",
        started_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // FIXED: Update profile to increment challenges_in_progress counter
  const { data: profile } = await supabase
    .from("user_ramadan_profile")
    .select("challenges_in_progress")
    .eq("user_id", request.user_id)
    .eq("ramadan_year", request.ramadan_year)
    .single();

  await supabase
    .from("user_ramadan_profile")
    .upsert({
      user_id: request.user_id,
      ramadan_year: request.ramadan_year,
      challenges_in_progress: (profile?.challenges_in_progress || 0) + 1,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,ramadan_year" });

  return data;
};

export const updateChallengeProgress = async (
  request: UpdateChallengeProgressRequest,
): Promise<UserRamadanChallenge | null> => {
  const { data, error } = await supabase
    .from("user_ramadan_challenges")
    .update({
      progress: request.progress as unknown as ChallengeProgress,
      status: request.status,
      last_updated_at: new Date().toISOString(),
      ...(request.status === "completed" && {
        completed_at: new Date().toISOString(),
      }),
    })
    .eq("user_id", request.user_id)
    .eq("challenge_id", request.challenge_id)
    .eq("ramadan_year", request.ramadan_year)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ============================================
// DAILY LOG
// ============================================

export const getDailyLog = async (
  userId: string,
  date: string,
): Promise<RamadanDailyLog[]> => {
  const { data, error } = await supabase
    .from("ramadan_daily_log")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date);

  if (error) throw error;
  return data || [];
};

export const getUserDailyLogs = async (
  userId: string,
  ramadanYear: number,
): Promise<RamadanDailyLog[]> => {
  const { data, error } = await supabase
    .from("ramadan_daily_log")
    .select("*")
    .eq("user_id", userId)
    .eq("ramadan_year", ramadanYear)
    .order("date", { ascending: true });

  if (error) throw error;
  return data || [];
};

export const logDailyProgress = async (
  log: Omit<RamadanDailyLog, "id" | "created_at">,
): Promise<RamadanDailyLog | null> => {
  const { data, error } = await supabase
    .from("ramadan_daily_log")
    .upsert([log], {
      onConflict: "user_id,challenge_id,date",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ============================================
// BADGES
// ============================================

export const getAllBadges = async (): Promise<Badge[]> => {
  const { data, error } = await supabase.from("badges").select("*");

  if (error) throw error;
  return data || [];
};

export const getUserBadges = async (
  userId: string,
): Promise<UserBadgeWithDetails[]> => {
  const { data, error } = await supabase
    .from("user_badges")
    .select(
      `
      *,
      badge:badges(*)
    `,
    )
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const awardBadge = async (
  userId: string,
  badgeId: string,
  challengeId?: string,
  ramadanYear?: number,
): Promise<UserBadge | null> => {
  const { data, error } = await supabase
    .from("user_badges")
    .insert([
      {
        user_id: userId,
        badge_id: badgeId,
        earned_from_challenge_id: challengeId || null,
        ramadan_year: ramadanYear || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const toggleBadgeShowcase = async (
  userId: string,
  badgeId: string,
  isShowcased: boolean,
): Promise<UserBadge | null> => {
  const { data, error } = await supabase
    .from("user_badges")
    .update({ is_showcased: isShowcased })
    .eq("user_id", userId)
    .eq("badge_id", badgeId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ============================================
// USER RAMADAN PROFILE
// ============================================

export const getUserRamadanProfile = async (
  userId: string,
  ramadanYear: number,
): Promise<UserRamadanProfile | null> => {
  const { data, error } = await supabase
    .from("user_ramadan_profile")
    .select("*")
    .eq("user_id", userId)
    .eq("ramadan_year", ramadanYear)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
};

export const createOrUpdateUserRamadanProfile = async (
  profile: Partial<UserRamadanProfile> & {
    user_id: string;
    ramadan_year: number;
  },
): Promise<UserRamadanProfile | null> => {
  const { data, error } = await supabase
    .from("user_ramadan_profile")
    .upsert([{ ...profile, updated_at: new Date().toISOString() }], {
      onConflict: "user_id,ramadan_year",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUserXP = async (
  userId: string,
  ramadanYear: number,
  xpToAdd: number,
): Promise<UserRamadanProfile | null> => {
  // Get current profile
  const current = await getUserRamadanProfile(userId, ramadanYear);
  const currentXP = current?.total_xp || 0;
  const newXP = currentXP + xpToAdd;

  // Calculate level (simple formula: level = floor(sqrt(xp / 100)))
  const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

  const { data, error } = await supabase
    .from("user_ramadan_profile")
    .upsert(
      [
        {
          user_id: userId,
          ramadan_year: ramadanYear,
          total_xp: newXP,
          level: newLevel,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "user_id,ramadan_year" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ============================================
// LEADERBOARD
// ============================================

export const getLeaderboard = async (
  ramadanYear: number,
  leaderboardType: string = "global",
  limit: number = 100,
): Promise<RamadanLeaderboard[]> => {
  const { data, error } = await supabase
    .from("ramadan_leaderboard")
    .select("*")
    .eq("ramadan_year", ramadanYear)
    .eq("leaderboard_type", leaderboardType)
    .order("rank", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getUserLeaderboardRank = async (
  userId: string,
  ramadanYear: number,
  leaderboardType: string = "global",
): Promise<RamadanLeaderboard | null> => {
  const { data, error } = await supabase
    .from("ramadan_leaderboard")
    .select("*")
    .eq("user_id", userId)
    .eq("ramadan_year", ramadanYear)
    .eq("leaderboard_type", leaderboardType)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
};

// ============================================
// REFLECTIONS
// ============================================

export const getUserReflections = async (
  userId: string,
  ramadanYear: number,
): Promise<RamadanReflection[]> => {
  const { data, error } = await supabase
    .from("ramadan_reflections")
    .select("*")
    .eq("user_id", userId)
    .eq("ramadan_year", ramadanYear)
    .order("date", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createReflection = async (
  request: CreateReflectionRequest,
): Promise<RamadanReflection | null> => {
  const wordCount = request.reflection_text.split(/\s+/).length;

  const { data, error } = await supabase
    .from("ramadan_reflections")
    .insert([
      {
        ...request,
        word_count: wordCount,
        is_private: request.is_private ?? true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateReflection = async (
  reflectionId: string,
  updates: Partial<RamadanReflection>,
): Promise<RamadanReflection | null> => {
  const { data, error } = await supabase
    .from("ramadan_reflections")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reflectionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteReflection = async (reflectionId: string): Promise<void> => {
  const { error } = await supabase
    .from("ramadan_reflections")
    .delete()
    .eq("id", reflectionId);

  if (error) throw error;
};

// ============================================
// TEAMS
// ============================================

export const getAllTeams = async (
  ramadanYear: number,
): Promise<RamadanTeam[]> => {
  const { data, error } = await supabase
    .from("ramadan_teams")
    .select("*")
    .eq("ramadan_year", ramadanYear)
    .eq("is_private", false)
    .order("total_xp", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getTeamByCode = async (
  teamCode: string,
): Promise<RamadanTeam | null> => {
  const { data, error } = await supabase
    .from("ramadan_teams")
    .select("*")
    .eq("team_code", teamCode)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
};

export const getUserTeam = async (
  userId: string,
  ramadanYear: number,
): Promise<RamadanTeam | null> => {
  const { data, error } = await supabase
    .from("ramadan_team_members")
    .select(
      `
      *,
      team:ramadan_teams(*)
    `,
    )
    .eq("user_id", userId)
    .eq("team.ramadan_year", ramadanYear)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data?.team || null;
};

export const createTeam = async (
  request: CreateTeamRequest,
): Promise<RamadanTeam | null> => {
  // Generate unique 6-character team code
  const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data: team, error: teamError } = await supabase
    .from("ramadan_teams")
    .insert([
      {
        team_name: request.team_name,
        team_code: teamCode,
        creator_id: request.creator_id,
        ramadan_year: request.ramadan_year,
        max_members: request.max_members || 10,
        is_private: request.is_private || false,
      },
    ])
    .select()
    .single();

  if (teamError) throw teamError;

  // Add creator as team member
  const { error: memberError } = await supabase
    .from("ramadan_team_members")
    .insert([
      {
        team_id: team.id,
        user_id: request.creator_id,
        role: "creator",
      },
    ]);

  if (memberError) throw memberError;

  return team;
};

export const joinTeam = async (
  request: JoinTeamRequest,
): Promise<RamadanTeamMember | null> => {
  // Get team by code
  const team = await getTeamByCode(request.team_code);
  if (!team) throw new Error("Team not found");

  // Check if team is full
  if (team.member_count >= team.max_members) {
    throw new Error("Team is full");
  }

  const { data, error } = await supabase
    .from("ramadan_team_members")
    .insert([
      {
        team_id: team.id,
        user_id: request.user_id,
        role: "member",
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Update team member count
  await supabase
    .from("ramadan_teams")
    .update({ member_count: team.member_count + 1 })
    .eq("id", team.id);

  return data;
};

export const leaveTeam = async (
  userId: string,
  teamId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("ramadan_team_members")
    .delete()
    .eq("user_id", userId)
    .eq("team_id", teamId);

  if (error) throw error;

  // Update team member count
  const { data: team } = await supabase
    .from("ramadan_teams")
    .select("member_count")
    .eq("id", teamId)
    .single();

  if (team) {
    await supabase
      .from("ramadan_teams")
      .update({ member_count: Math.max(0, team.member_count - 1) })
      .eq("id", teamId);
  }
};

export const getTeamMembers = async (
  teamId: string,
): Promise<RamadanTeamMember[]> => {
  const { data, error } = await supabase
    .from("ramadan_team_members")
    .select("*")
    .eq("team_id", teamId)
    .order("xp_contributed", { ascending: false });

  if (error) throw error;
  return data || [];
};
