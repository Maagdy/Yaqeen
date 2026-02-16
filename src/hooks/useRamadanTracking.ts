import { useCallback } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAuth } from "./useAuth";
import { updateDailyProgress } from "@/api/domains/user/user-queries";
import { RamadanChallengeService } from "@/services/ramadan-challenge-service";
import { getCurrentRamadanYear } from "@/utils/ramadan-dates";
import type { UserProgress } from "@/api/domains/user/user.types";
import { queryClient } from "@/contexts/queryClient";

export const useRamadanTracking = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const trackActivity = useCallback(
    async (
      progress: Partial<UserProgress>,
      showNotifications: boolean = true,
    ) => {
      if (!user?.id) {
        if (showNotifications) {
          toast.warning(t("common.login_required"));
        }
        throw new Error("User must be logged in");
      }

      try {
        const dailyProgressResult = await updateDailyProgress(user.id, progress);

        const completedChallenges =
          await RamadanChallengeService.trackUserActivity({
            userId: user.id,
            pagesRead: progress.pages_read || 0,
            minutesListened: progress.minutes_listened || 0,
          });

        const ramadanYear = getCurrentRamadanYear();

        queryClient.invalidateQueries({
          queryKey: ["user-ramadan-challenges", user.id, ramadanYear],
        });
        queryClient.invalidateQueries({
          queryKey: ["user-ramadan-profile", user.id, ramadanYear],
        });
        queryClient.invalidateQueries({
          queryKey: ["ramadan-daily-log", user.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["user-badges", user.id],
        });

        if (showNotifications) {
          if (completedChallenges.length > 0) {
            completedChallenges.forEach((challenge) => {
              toast.success(
                `🎉 ${t("ramadan.challengeCompleted")}: ${challenge.challengeName}!`,
                { autoClose: 5000 },
              );

              toast.info(
                `⭐ +${challenge.xpAwarded} XP ${t("ramadan.awarded")}`,
                { autoClose: 3000 },
              );

              if (challenge.badgeAwarded) {
                toast.success(
                  `🏆 ${t("ramadan.badgeEarned")}: ${challenge.badgeAwarded}!`,
                  { autoClose: 5000 },
                );
              }

              if (challenge.leveledUp) {
                toast.success(
                  `🎊 ${t("ramadan.levelUp")}: ${t("ramadan.level")} ${challenge.newLevel}!`,
                  { autoClose: 5000 },
                );
              }
            });
          } else {
            toast.success(t("ramadan.progressUpdated"));
          }
        }

        return {
          dailyProgress: dailyProgressResult,
          completedChallenges,
        };
      } catch (error) {
        if (showNotifications) {
          toast.error(
            error instanceof Error
              ? error.message
              : t("ramadan.trackingError"),
          );
        }
        throw error;
      }
    },
    [user?.id, t],
  );

  const trackPagesRead = useCallback(
    async (pages: number, showNotifications: boolean = true) => {
      return trackActivity({ pages_read: pages }, showNotifications);
    },
    [trackActivity],
  );

  const trackMinutesListened = useCallback(
    async (minutes: number, showNotifications: boolean = true) => {
      return trackActivity({ minutes_listened: minutes }, showNotifications);
    },
    [trackActivity],
  );

  const trackCombined = useCallback(
    async (pages: number, minutes: number, showNotifications: boolean = true) => {
      return trackActivity(
        {
          pages_read: pages,
          minutes_listened: minutes,
        },
        showNotifications,
      );
    },
    [trackActivity],
  );

  return {
    trackActivity,
    trackPagesRead,
    trackMinutesListened,
    trackCombined,
    isLoggedIn: !!user,
  };
};
