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
  const inProgressChallenges =
    userChallenges.filter((c) => c.status === "in_progress").length || 0;

  const nextLevelXP = Math.pow(level, 2) * 100;
  const currentLevelXP = Math.pow(level - 1, 2) * 100;
  const xpProgress = totalXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const levelProgress = Math.min((xpProgress / xpNeeded) * 100, 100);

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
      value: currentStreak,
    },
    {
      icon: "✅",
      label: t("ramadan.stats.completed"),
      value: completedChallenges,
    },
    {
      icon: "⏳",
      label: t("ramadan.stats.inProgress"),
      value: inProgressChallenges,
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-primary p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-white">{t("ramadan.yourProgress")}</h2>

      <div className="mb-6 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between text-white">
          <span className="text-sm font-semibold">
            {t("ramadan.stats.level")} {level}
          </span>
          <span className="text-sm">
            {xpProgress.toLocaleString()} / {xpNeeded.toLocaleString()} XP
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-white/90">
          {Math.round(xpNeeded - xpProgress)} XP {t("ramadan.stats.untilNextLevel")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <div className="mb-2 text-3xl">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-white/90">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
