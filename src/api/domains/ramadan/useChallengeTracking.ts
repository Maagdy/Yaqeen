/**
 * Hook for Challenge Tracking Integration
 *
 * Use this hook to automatically sync Ramadan challenges with user activities.
 */

import { useCallback } from "react";
import { useAuth } from "@/hooks";
import { syncChallengesWithDailyProgress } from "./challenge-tracker";
import { updateDailyProgress } from "../user/user-queries";
import type { UserProgress } from "../user/user.types";

export const useChallengeTracking = () => {
  const { user } = useAuth();

  /**
   * Update daily progress AND automatically track challenge progress
   */
  const updateProgressWithChallenges = useCallback(
    async (progress: Partial<UserProgress>) => {
      if (!user?.id) {
        throw new Error("User must be logged in");
      }

      // Update regular daily progress first
      const result = await updateDailyProgress(user.id, progress);

      // Sync with Ramadan challenges
      await syncChallengesWithDailyProgress(
        user.id,
        progress.pages_read || 0,
        progress.minutes_listened || 0,
      );

      return result;
    },
    [user],
  );

  return {
    updateProgressWithChallenges,
  };
};

/**
 * Example Usage:
 *
 * import { useChallengeTracking } from "@/api/domains/ramadan/useChallengeTracking";
 *
 * const MyComponent = () => {
 *   const { updateProgressWithChallenges } = useChallengeTracking();
 *
 *   const handleReadPages = async () => {
 *     await updateProgressWithChallenges({
 *       pages_read: 20,
 *       minutes_listened: 45,
 *     });
 *   };
 * };
 */
