import { useTranslation } from "react-i18next";
import type {
  UserRamadanProfile,
  UserChallengeWithDetails,
} from "@/api/domains/ramadan/ramadan.types";

interface UserStatsCardProps {
  profile: UserRamadanProfile | null | undefined;
  userChallenges: UserChallengeWithDetails[];
}

export const UserStatsCard = ({
  profile,
  userChallenges,
}: UserStatsCardProps) => {
  const { t } = useTranslation();

  const totalXP = profile?.total_xp || 0;
  const level = profile?.level || 1;
  const currentStreak = profile?.ramadan_streak || 0;
  const completedChallenges =
    userChallenges.filter((c) => c.status === "completed").length || 0;

  const nextLevelXP = Math.pow(level, 2) * 100;
  const currentLevelXP = Math.pow(level - 1, 2) * 100;
  const xpProgress = totalXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const levelProgress = Math.min((xpProgress / xpNeeded) * 100, 100);

  const pagesReadToday = profile?.pages_read_today || 0;
  const badgesEarned = profile?.badges_earned || 0;

  const stats = [
    {
      icon: "🏆",
      label: t("ramadan.stats.level"),
      value: level,
    },
    {
      icon: "⭐",
      label: t("ramadan.stats.totalXP"),
      value: totalXP.toLocaleString(),
    },
    {
      icon: "🔥",
      label: t("ramadan.stats.streak"),
      value: `${currentStreak} ${t("common.days")}`,
    },
    {
      icon: "📖",
      label: t("ramadan.progress.todayReading"),
      value: `${pagesReadToday} ${t("ramadan.progress.pages")}`,
    },
    {
      icon: "✅",
      label: t("ramadan.stats.completed"),
      value: completedChallenges,
    },
    {
      icon: "🏅",
      label: t("ramadan.badges.totalBadges"),
      value: badgesEarned,
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-primary p-4 sm:p-6 shadow-lg">
      <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-white">{t("ramadan.yourProgress")}</h2>

      <div className="mb-4 sm:mb-6 rounded-lg border border-white/20 bg-white/10 p-3 sm:p-4 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between text-white flex-wrap gap-1">
          <span className="text-xs sm:text-sm font-semibold">
            {t("ramadan.stats.level")} {level}
          </span>
          <span className="text-xs sm:text-sm">
            {xpProgress.toLocaleString()} / {xpNeeded.toLocaleString()} XP
          </span>
        </div>
        <div className="h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-white/90">
          {Math.round(xpNeeded - xpProgress)} XP {t("ramadan.stats.untilNextLevel")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg border border-white/20 bg-white/10 p-3 sm:p-4 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
          >
            <div className="mb-1 sm:mb-2 text-2xl sm:text-3xl">{stat.icon}</div>
            <div className="text-lg sm:text-xl font-bold text-white truncate">{stat.value}</div>
            <div className="text-xs sm:text-sm text-white/90">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
