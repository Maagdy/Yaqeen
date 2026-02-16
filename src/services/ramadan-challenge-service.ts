import supabase from "@/lib/supabase-client";
import {
  getCurrentRamadanYear,
  getCurrentRamadanDay,
} from "@/utils/ramadan-dates";
import type {
  RamadanChallenge,
  UserRamadanChallenge,
  ChallengeConfig,
  ChallengeProgress,
  ChallengeStatus,
} from "@/api/domains/ramadan/ramadan.types";

interface UserActivity {
  userId: string;
  pagesRead?: number;
  minutesListened?: number;
  surahsCompleted?: number[];
  reflectionWritten?: boolean;
  timestamp?: Date;
}

interface ChallengeCompletionResult {
  challengeId: string;
  challengeName: string;
  xpAwarded: number;
  badgeAwarded?: string;
  leveledUp: boolean;
  newLevel?: number;
}

const isWithinTimeRange = (timeRange: string): boolean => {
  const [startTime, endTime] = timeRange.split("-");
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return currentTime >= startTime && currentTime <= endTime;
};

const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const trackUserActivity = async (
  activity: UserActivity,
): Promise<ChallengeCompletionResult[]> => {
  const { userId, pagesRead = 0, minutesListened = 0, reflectionWritten = false } = activity;

  const ramadanYear = getCurrentRamadanYear();
  const ramadanDay = getCurrentRamadanDay();

  if (ramadanDay === 0) {
    return [];
  }

  const today = new Date().toISOString().split("T")[0];
  const completedChallenges: ChallengeCompletionResult[] = [];

  try {
    // Get all user's enrolled challenges
    const { data: userChallenges, error } = await supabase
      .from("user_ramadan_challenges")
      .select("*, challenge:ramadan_challenges(*)")
      .eq("user_id", userId)
      .eq("ramadan_year", ramadanYear)
      .eq("status", "in_progress");

    if (error) throw error;
    if (!userChallenges || userChallenges.length === 0) return [];

    for (const userChallenge of userChallenges) {
      const challenge = userChallenge.challenge as unknown as RamadanChallenge;
      const config = challenge.config as ChallengeConfig;
      const progress = userChallenge.progress as ChallengeProgress;

      let updated = false;
      const newProgress = { ...progress };
      let newStatus: ChallengeStatus = "in_progress";

      if (challenge.challenge_type === "daily") {
        updated = await processDailyChallenge(
          userId,
          userChallenge,
          challenge,
          config,
          newProgress,
          ramadanYear,
          ramadanDay,
          today,
          pagesRead,
          minutesListened,
          reflectionWritten,
        );

        if (updated) {
          const daysCompleted = newProgress.days_completed?.length || 0;
          const target = config.target || 30;

          if (daysCompleted >= target) {
            newStatus = "completed";
            const result = await completeChallenge(userId, userChallenge, ramadanYear);
            completedChallenges.push(result);
          }
        }
      }

      else if (challenge.challenge_type === "progressive") {
        updated = await processProgressiveChallenge(
          userChallenge,
          challenge,
          config,
          newProgress,
          pagesRead,
          minutesListened,
        );

        if (updated) {
          const current = newProgress.current || 0;
          const target = config.target || 1;

          if (current >= target) {
            newStatus = "completed";
            const result = await completeChallenge(userId, userChallenge, ramadanYear);
            completedChallenges.push(result);
          }
        }
      }

      else if (challenge.challenge_type === "milestone") {
        updated = await processMilestoneChallenge(
          userId,
          userChallenge,
          challenge,
          config,
          newProgress,
          ramadanYear,
          ramadanDay,
          today,
          pagesRead,
          minutesListened,
        );

        if (updated) {
          const current = newProgress.current || 0;
          const target = config.days_required || config.target || 1;

          if (current >= target) {
            newStatus = "completed";
            const result = await completeChallenge(userId, userChallenge, ramadanYear);
            completedChallenges.push(result);
          }
        }
      }

      else if (challenge.challenge_type === "special") {
        updated = await processSpecialChallenge(
          userId,
          userChallenge,
          challenge,
          config,
          newProgress,
          ramadanYear,
          ramadanDay,
          today,
          pagesRead,
        );

        if (updated) {
          const nightsCompleted = (newProgress.nights_completed as number[] | undefined)?.length || 0;
          const totalNights = (config.nights as number[] | undefined)?.length || 10;

          if (nightsCompleted >= totalNights) {
            newStatus = "completed";
            const result = await completeChallenge(userId, userChallenge, ramadanYear);
            completedChallenges.push(result);
          }
        }
      }

      if (updated) {
        await supabase
          .from("user_ramadan_challenges")
          .update({
            progress: newProgress,
            status: newStatus,
            last_updated_at: new Date().toISOString(),
            ...(newStatus === "completed" && {
              completed_at: new Date().toISOString(),
            }),
          })
          .eq("id", userChallenge.id);
      }
    }

    await updateRamadanStreak(userId, ramadanYear, today);

    return completedChallenges;
  } catch (error) {
    console.error("Error tracking user activity:", error);
    throw error;
  }
};

const processDailyChallenge = async (
  userId: string,
  userChallenge: UserRamadanChallenge,
  challenge: RamadanChallenge,
  config: ChallengeConfig,
  progress: ChallengeProgress,
  ramadanYear: number,
  ramadanDay: number,
  today: string,
  pagesRead: number,
  minutesListened: number,
  reflectionWritten: boolean,
): Promise<boolean> => {
  let dailyTargetMet = false;
  let progressData: Record<string, unknown> = {};

  if (challenge.category === "quran" && config.unit === "pages") {
    const target = config.target || 0;
    dailyTargetMet = pagesRead >= target;
    progressData = { pages_read: pagesRead };
  } else if (challenge.category === "listening" && config.unit === "minutes") {
    const target = config.target || 0;
    dailyTargetMet = minutesListened >= target;
    progressData = { minutes_listened: minutesListened };
  } else if (challenge.category === "reflection") {
    dailyTargetMet = reflectionWritten;
    progressData = { reflection_written: reflectionWritten };
  }

  await supabase.from("ramadan_daily_log").upsert(
    {
      user_id: userId,
      challenge_id: userChallenge.challenge_id,
      ramadan_year: ramadanYear,
      ramadan_day: ramadanDay,
      date: today,
      completed: dailyTargetMet,
      progress_data: progressData,
      ...(dailyTargetMet && { completed_at: new Date().toISOString() }),
    },
    { onConflict: "user_id,challenge_id,date" },
  );

  if (dailyTargetMet) {
    const daysCompleted = progress.days_completed || [];
    if (!daysCompleted.includes(ramadanDay)) {
      progress.days_completed = [...daysCompleted, ramadanDay];
      progress.current = progress.days_completed.length;
      progress.target = 30;
      return true;
    }
  }

  return false;
};

const processProgressiveChallenge = async (
  _userChallenge: UserRamadanChallenge,
  challenge: RamadanChallenge,
  config: ChallengeConfig,
  progress: ChallengeProgress,
  pagesRead: number,
  minutesListened: number,
): Promise<boolean> => {
  let updated = false;

  if (challenge.category === "quran" && config.unit === "pages") {
    const currentPages = progress.pages_read || 0;
    const newTotal = currentPages + pagesRead;
    progress.pages_read = newTotal;
    progress.current = newTotal;
    progress.target = config.target || 604;
    updated = true;
  } else if (challenge.category === "quran" && config.unit === "juz") {
    const currentJuz = progress.current || 0;
    const pagesPerJuz = 20;
    const juzCompleted = Math.floor(pagesRead / pagesPerJuz);

    if (juzCompleted > 0) {
      progress.current = Math.min(currentJuz + juzCompleted, 30);
      progress.target = 30;
      updated = true;
    }
  } else if (challenge.category === "listening" && config.unit === "minutes") {
    const currentMinutes = progress.minutes_listened || 0;
    const newTotal = currentMinutes + minutesListened;
    progress.minutes_listened = newTotal;
    progress.current = newTotal;
    progress.target = config.target || 1000;
    updated = true;
  }

  return updated;
};

const processMilestoneChallenge = async (
  userId: string,
  userChallenge: UserRamadanChallenge,
  _challenge: RamadanChallenge,
  config: ChallengeConfig,
  progress: ChallengeProgress,
  ramadanYear: number,
  ramadanDay: number,
  today: string,
  pagesRead: number,
  minutesListened: number,
): Promise<boolean> => {
  let conditionMet = false;
  let progressData: Record<string, unknown> = {};

  if (config.time_range) {
    const inTimeRange = isWithinTimeRange(config.time_range);
    if (inTimeRange && pagesRead > 0) {
      conditionMet = true;
      progressData = { pages_read: pagesRead, time_range: config.time_range };
    }
  }
  else if (config.min_pages && pagesRead >= config.min_pages) {
    conditionMet = true;
    progressData = { pages_read: pagesRead };
  }
  else if (pagesRead > 0 || minutesListened > 0) {
    conditionMet = true;
    progressData = { pages_read: pagesRead, minutes_listened: minutesListened };
  }

  if (conditionMet) {
    await supabase.from("ramadan_daily_log").upsert(
      {
        user_id: userId,
        challenge_id: userChallenge.challenge_id,
        ramadan_year: ramadanYear,
        ramadan_day: ramadanDay,
        date: today,
        completed: true,
        progress_data: progressData,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,challenge_id,date" },
    );

    const daysCompleted = progress.days_completed || [];
    if (!daysCompleted.includes(ramadanDay)) {
      progress.days_completed = [...daysCompleted, ramadanDay];
      progress.current = progress.days_completed.length;
      progress.target = config.days_required || 20;
      return true;
    }
  }

  return false;
};

const processSpecialChallenge = async (
  userId: string,
  userChallenge: UserRamadanChallenge,
  _challenge: RamadanChallenge,
  config: ChallengeConfig,
  progress: ChallengeProgress,
  ramadanYear: number,
  ramadanDay: number,
  today: string,
  pagesRead: number,
): Promise<boolean> => {
  const specialNights = config.nights || [21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  if (specialNights.includes(ramadanDay) && pagesRead >= (config.min_pages || 5)) {
    await supabase.from("ramadan_daily_log").upsert(
      {
        user_id: userId,
        challenge_id: userChallenge.challenge_id,
        ramadan_year: ramadanYear,
        ramadan_day: ramadanDay,
        date: today,
        completed: true,
        progress_data: { pages_read: pagesRead, special_night: true },
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,challenge_id,date" },
    );

    const nightsCompleted = (progress.nights_completed as number[] | undefined) || [];
    if (!nightsCompleted.includes(ramadanDay)) {
      progress.nights_completed = [...nightsCompleted, ramadanDay] as never;
      progress.current = (progress.nights_completed as number[]).length;
      progress.target = specialNights.length;
      return true;
    }
  }

  return false;
};

const completeChallenge = async (
  userId: string,
  userChallenge: UserRamadanChallenge,
  ramadanYear: number,
): Promise<ChallengeCompletionResult> => {
  const challenge = (userChallenge as UserRamadanChallenge & { challenge: RamadanChallenge }).challenge;
  const xpReward = challenge.xp_reward;

  const { data: currentProfile } = await supabase
    .from("user_ramadan_profile")
    .select("*")
    .eq("user_id", userId)
    .eq("ramadan_year", ramadanYear)
    .single();

  const currentXP = currentProfile?.total_xp || 0;
  const newXP = currentXP + xpReward;
  const oldLevel = calculateLevel(currentXP);
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > oldLevel;

  await supabase.from("user_ramadan_profile").upsert(
    {
      user_id: userId,
      ramadan_year: ramadanYear,
      total_xp: newXP,
      level: newLevel,
      challenges_completed: (currentProfile?.challenges_completed || 0) + 1,
      challenges_in_progress: Math.max(
        0,
        (currentProfile?.challenges_in_progress || 1) - 1,
      ),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,ramadan_year" },
  );

  let badgeName: string | undefined;
  if (challenge.badge_id) {
    try {
      const { data: badge } = await supabase
        .from("badges")
        .select("title_en")
        .eq("id", challenge.badge_id)
        .single();

      await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: challenge.badge_id,
        earned_from_challenge_id: userChallenge.challenge_id,
        ramadan_year: ramadanYear,
      });

      badgeName = badge?.title_en;
    } catch {
      // Badge error (likely duplicate)
    }
  }

  await checkMilestoneBadges(userId, ramadanYear);

  return {
    challengeId: userChallenge.challenge_id,
    challengeName: challenge.title_en,
    xpAwarded: xpReward,
    badgeAwarded: badgeName,
    leveledUp,
    newLevel: leveledUp ? newLevel : undefined,
  };
};

const checkMilestoneBadges = async (
  userId: string,
  ramadanYear: number,
): Promise<void> => {
  const { data: profile } = await supabase
    .from("user_ramadan_profile")
    .select("*")
    .eq("user_id", userId)
    .eq("ramadan_year", ramadanYear)
    .single();

  if (!profile) return;

  const badgesToCheck = [
    { count: 1, badgeKey: "first_challenge" },
    { count: 10, badgeKey: "challenge_master" },
  ];

  for (const { count, badgeKey } of badgesToCheck) {
    if (profile.challenges_completed === count) {
      const { data: badge } = await supabase
        .from("badges")
        .select("id")
        .eq("badge_key", badgeKey)
        .single();

      if (badge) {
        try {
          await supabase.from("user_badges").insert({
            user_id: userId,
            badge_id: badge.id,
            ramadan_year: ramadanYear,
          });
        } catch {
          // Badge already awarded
        }
      }
    }
  }
};

/**
 * Update Ramadan streak
 */
const updateRamadanStreak = async (
  userId: string,
  ramadanYear: number,
  today: string,
): Promise<void> => {
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const { data: profile } = await supabase
    .from("user_ramadan_profile")
    .select("*")
    .eq("user_id", userId)
    .eq("ramadan_year", ramadanYear)
    .single();

  const lastActivity = profile?.last_activity_date;
  const currentStreak = profile?.ramadan_streak || 0;

  let newStreak = currentStreak;

  if (!lastActivity) {
    newStreak = 1;
  } else if (lastActivity === today) {
    return; // Already updated today
  } else if (lastActivity === yesterday) {
    newStreak = currentStreak + 1;
  } else {
    newStreak = 1; // Streak broken
  }

  await supabase.from("user_ramadan_profile").upsert(
    {
      user_id: userId,
      ramadan_year: ramadanYear,
      ramadan_streak: newStreak,
      last_activity_date: today,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,ramadan_year" },
  );

  // Check streak badges
  await checkStreakBadges(userId, newStreak, ramadanYear);
};

/**
 * Check and award streak badges
 */
const checkStreakBadges = async (
  userId: string,
  streak: number,
  ramadanYear: number,
): Promise<void> => {
  const streakMilestones = [
    { streak: 7, badgeKey: "week_1" },
    { streak: 15, badgeKey: "week_2" },
    { streak: 30, badgeKey: "perfect_streak" },
  ];

  for (const { streak: required, badgeKey } of streakMilestones) {
    if (streak === required) {
      const { data: badge } = await supabase
        .from("badges")
        .select("id")
        .eq("badge_key", badgeKey)
        .single();

      if (badge) {
        try {
          await supabase.from("user_badges").insert({
            user_id: userId,
            badge_id: badge.id,
            ramadan_year: ramadanYear,
          });
        } catch {
          // Streak badge already awarded
        }
      }
    }
  }
};

export const RamadanChallengeService = {
  trackUserActivity,
  calculateLevel,
};
