/**
 * Challenge Tracker Service
 *
 * Automatically tracks and updates challenge progress based on user activities.
 * Integrates with existing daily_progress updates.
 */

import supabase from "@/lib/supabase-client";
import {
  getUserChallenges,
  updateChallengeProgress,
  updateUserXP,
  awardBadge,
  logDailyProgress,
  createOrUpdateUserRamadanProfile,
} from "./ramadan-queries";
import type {
  UserChallengeWithDetails,
  ChallengeConfig,
  ChallengeProgress,
} from "./ramadan.types";

// ============================================
// CHALLENGE TRACKING LOGIC
// ============================================

/**
 * Track daily reading progress for all enrolled challenges
 */
export const trackReadingProgress = async (
  userId: string,
  pagesRead: number,
  ramadanYear: number,
  ramadanDay: number,
): Promise<void> => {
  const userChallenges = await getUserChallenges(userId, ramadanYear);
  const today = new Date().toISOString().split("T")[0];

  // Filter challenges related to reading
  const readingChallenges = userChallenges.filter(
    (uc) =>
      uc.status === "in_progress" &&
      uc.challenge.category === "quran" &&
      (uc.challenge.config as ChallengeConfig).unit === "pages",
  );

  for (const userChallenge of readingChallenges) {
    const config = userChallenge.challenge.config as ChallengeConfig;
    const progress = userChallenge.progress as ChallengeProgress;

    // Update progress based on challenge type
    if (userChallenge.challenge.challenge_type === "daily") {
      // Daily challenge: check if today's target is met
      const dailyTarget = config.target || 0;
      const completed = pagesRead >= dailyTarget;

      // Log daily progress
      await logDailyProgress({
        user_id: userId,
        challenge_id: userChallenge.challenge_id,
        ramadan_year: ramadanYear,
        ramadan_day: ramadanDay,
        date: today,
        completed,
        progress_data: { pages_read: pagesRead },
        completed_at: completed ? new Date().toISOString() : null,
      });

      // Update overall progress
      if (completed) {
        const daysCompleted = [...(progress.days_completed || []), ramadanDay];
        const newProgress: Partial<ChallengeProgress> = {
          ...progress,
          days_completed: daysCompleted,
          current: daysCompleted.length,
          target: 30, // 30 days of Ramadan
        };

        // Check if challenge is completed
        const isCompleted = daysCompleted.length >= 30;

        await updateChallengeProgress({
          user_id: userId,
          challenge_id: userChallenge.challenge_id,
          ramadan_year: ramadanYear,
          progress: newProgress,
          status: isCompleted ? "completed" : "in_progress",
        });

        // Award XP and badge if completed
        if (isCompleted) {
          await completeChallenge(
            userId,
            userChallenge,
            ramadanYear,
          );
        }
      }
    } else if (userChallenge.challenge.challenge_type === "progressive") {
      // Progressive challenge: accumulate total pages
      const currentPages = (progress.pages_read || 0) + pagesRead;
      const target = config.target || 604; // Default: full Quran

      const newProgress: Partial<ChallengeProgress> = {
        ...progress,
        pages_read: currentPages,
        current: currentPages,
        target,
      };

      // Check if completed
      const isCompleted = currentPages >= target;

      await updateChallengeProgress({
        user_id: userId,
        challenge_id: userChallenge.challenge_id,
        ramadan_year: ramadanYear,
        progress: newProgress,
        status: isCompleted ? "completed" : "in_progress",
      });

      // Award XP and badge if completed
      if (isCompleted && userChallenge.status !== "completed") {
        await completeChallenge(
          userId,
          userChallenge,
          ramadanYear,
        );
      }
    }
  }
};

/**
 * Track listening progress for audio-related challenges
 */
export const trackListeningProgress = async (
  userId: string,
  minutesListened: number,
  ramadanYear: number,
  ramadanDay: number,
): Promise<void> => {
  const userChallenges = await getUserChallenges(userId, ramadanYear);
  const today = new Date().toISOString().split("T")[0];

  // Filter listening challenges
  const listeningChallenges = userChallenges.filter(
    (uc) =>
      uc.status === "in_progress" &&
      uc.challenge.category === "listening",
  );

  for (const userChallenge of listeningChallenges) {
    const config = userChallenge.challenge.config as ChallengeConfig;
    const progress = userChallenge.progress as ChallengeProgress;

    if (userChallenge.challenge.challenge_type === "daily") {
      const dailyTarget = config.target || 0;
      const completed = minutesListened >= dailyTarget;

      // Log daily progress
      await logDailyProgress({
        user_id: userId,
        challenge_id: userChallenge.challenge_id,
        ramadan_year: ramadanYear,
        ramadan_day: ramadanDay,
        date: today,
        completed,
        progress_data: { minutes_listened: minutesListened },
        completed_at: completed ? new Date().toISOString() : null,
      });

      if (completed) {
        const daysCompleted = [...(progress.days_completed || []), ramadanDay];
        const newProgress: Partial<ChallengeProgress> = {
          ...progress,
          days_completed: daysCompleted,
          current: daysCompleted.length,
          target: 30,
        };

        const isCompleted = daysCompleted.length >= 30;

        await updateChallengeProgress({
          user_id: userId,
          challenge_id: userChallenge.challenge_id,
          ramadan_year: ramadanYear,
          progress: newProgress,
          status: isCompleted ? "completed" : "in_progress",
        });

        if (isCompleted) {
          await completeChallenge(userId, userChallenge, ramadanYear);
        }
      }
    }
  }
};

/**
 * Handle challenge completion: award XP, badges, update profile
 */
const completeChallenge = async (
  userId: string,
  userChallenge: UserChallengeWithDetails,
  ramadanYear: number,
): Promise<void> => {
  const xpReward = userChallenge.challenge.xp_reward;

  // Award XP
  await updateUserXP(userId, ramadanYear, xpReward);

  // Award badge if associated
  if (userChallenge.challenge.badge_id) {
    try {
      await awardBadge(
        userId,
        userChallenge.challenge.badge_id,
        userChallenge.challenge_id,
        ramadanYear,
      );
    } catch {
      // Badge might already be earned, ignore error
    }
  }

  // Update Ramadan profile stats
  const { data: currentProfile } = await supabase
    .from("user_ramadan_profile")
    .select("*")
    .eq("user_id", userId)
    .eq("ramadan_year", ramadanYear)
    .single();

  if (currentProfile) {
    await createOrUpdateUserRamadanProfile({
      user_id: userId,
      ramadan_year: ramadanYear,
      challenges_completed: (currentProfile.challenges_completed || 0) + 1,
      challenges_in_progress: Math.max(
        0,
        (currentProfile.challenges_in_progress || 0) - 1,
      ),
    });
  }
};

/**
 * Update Ramadan streak based on daily activity
 */
export const updateRamadanStreak = async (
  userId: string,
  ramadanYear: number,
): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];

  // Get user's profile
  const { data: profile } = await supabase
    .from("user_ramadan_profile")
    .select("*")
    .eq("user_id", userId)
    .eq("ramadan_year", ramadanYear)
    .single();

  const lastActivityDate = profile?.last_activity_date || null;
  const currentStreak = profile?.ramadan_streak || 0;

  let newStreak = currentStreak;

  if (!lastActivityDate) {
    // First activity
    newStreak = 1;
  } else if (lastActivityDate === today) {
    // Already updated today
    return;
  } else if (lastActivityDate === yesterday) {
    // Continuing streak
    newStreak = currentStreak + 1;
  } else {
    // Streak broken
    newStreak = 1;
  }

  // Update profile
  await createOrUpdateUserRamadanProfile({
    user_id: userId,
    ramadan_year: ramadanYear,
    ramadan_streak: newStreak,
    last_activity_date: today,
  });

  // Check for streak badges
  await checkStreakBadges(userId, newStreak, ramadanYear);
};

/**
 * Check and award streak-based badges
 */
const checkStreakBadges = async (
  userId: string,
  streak: number,
  ramadanYear: number,
): Promise<void> => {
  const streakBadges = [
    { streak: 7, badgeKey: "week_1" },
    { streak: 15, badgeKey: "week_2" },
    { streak: 30, badgeKey: "perfect_streak" },
  ];

  for (const { streak: requiredStreak, badgeKey } of streakBadges) {
    if (streak >= requiredStreak) {
      // Get badge ID
      const { data: badge } = await supabase
        .from("badges")
        .select("id")
        .eq("badge_key", badgeKey)
        .single();

      if (badge) {
        try {
          await awardBadge(userId, badge.id, undefined, ramadanYear);
        } catch {
          // Badge already earned, ignore
        }
      }
    }
  }
};

/**
 * Check first challenge completion badge
 */
export const checkFirstChallengeBadge = async (
  userId: string,
  ramadanYear: number,
): Promise<void> => {
  // Get completed challenges count
  const { data: profile } = await supabase
    .from("user_ramadan_profile")
    .select("challenges_completed")
    .eq("user_id", userId)
    .eq("ramadan_year", ramadanYear)
    .single();

  if (profile && profile.challenges_completed === 1) {
    // Award "First Step" badge
    const { data: badge } = await supabase
      .from("badges")
      .select("id")
      .eq("badge_key", "first_challenge")
      .single();

    if (badge) {
      try {
        await awardBadge(userId, badge.id, undefined, ramadanYear);
      } catch {
        // Badge already earned
      }
    }
  }

  // Check for 10 challenges badge
  if (profile && profile.challenges_completed === 10) {
    const { data: badge } = await supabase
      .from("badges")
      .select("id")
      .eq("badge_key", "challenge_master")
      .single();

    if (badge) {
      try {
        await awardBadge(userId, badge.id, undefined, ramadanYear);
      } catch {
        // Badge already earned
      }
    }
  }
};

// ============================================
// INTEGRATION WITH EXISTING DAILY PROGRESS
// ============================================

/**
 * Main function to call when user updates daily progress
 * This integrates with your existing updateDailyProgress function
 */
export const syncChallengesWithDailyProgress = async (
  userId: string,
  pagesRead: number,
  minutesListened: number,
): Promise<void> => {
  const ramadanYear = 1447; // TODO: Calculate dynamically

  // Calculate Ramadan day (1-30)
  // TODO: Calculate based on actual Ramadan dates
  const ramadanDay = Math.min(Math.floor(Math.random() * 30) + 1, 30);

  try {
    // Track reading progress
    if (pagesRead > 0) {
      await trackReadingProgress(userId, pagesRead, ramadanYear, ramadanDay);
    }

    // Track listening progress
    if (minutesListened > 0) {
      await trackListeningProgress(
        userId,
        minutesListened,
        ramadanYear,
        ramadanDay,
      );
    }

    // Update Ramadan streak
    await updateRamadanStreak(userId, ramadanYear);

    // Check for first challenge badge
    await checkFirstChallengeBadge(userId, ramadanYear);
  } catch (error) {
    console.error("Error syncing challenges:", error);
    // Don't throw - we don't want to break the main daily progress update
  }
};
