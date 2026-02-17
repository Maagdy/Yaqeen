import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks";
import { formatNumber } from "@/utils/numbers";
import type { RamadanChallenge } from "@/api/domains/ramadan/ramadan.types";

interface ChallengeCardProps {
  challenge: RamadanChallenge;
  onEnroll?: () => void;
  isEnrolled?: boolean;
  progress?: number;
}

export const ChallengeCard = ({
  challenge,
  onEnroll,
  isEnrolled = false,
  progress = 0,
}: ChallengeCardProps) => {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const isRTL = i18n.language === "ar";

  const title = isRTL ? challenge.title_ar : challenge.title_en;
  const description = isRTL
    ? challenge.description_ar
    : challenge.description_en;

  const difficultyColors = {
    easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    medium:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    hard: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
  };

  const categoryIcons = {
    quran: "📖",
    prayer: "🕌",
    listening: "🎧",
    reflection: "✍️",
    community: "👥",
    charity: "💰",
  };

  const typeLabels = {
    progressive: {
      labelKey: "ramadan.type.progressive" as const,
      icon: "⚡",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    milestone: {
      labelKey: "ramadan.type.milestone" as const,
      icon: "⚡",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    daily: {
      labelKey: "ramadan.type.daily" as const,
      icon: "📅",
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    special: {
      labelKey: "ramadan.type.special" as const,
      icon: "✨",
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
  };

  const typeInfo = typeLabels[challenge.challenge_type];

  return (
    <div
      className="group relative overflow-hidden rounded-xl border-2 border-border bg-surface p-4 sm:p-6 transition-all hover:shadow-lg hover:border-primary"
      style={{
        borderTopColor: challenge.color || "var(--color-primary)",
        borderTopWidth: "4px",
      }}
    >
      <div className="mb-3 sm:mb-4 flex items-start gap-2 sm:gap-3">
        <span className="text-3xl sm:text-4xl shrink-0">
          {challenge.icon || categoryIcons[challenge.category]}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-xl font-bold text-textPrimary">
            {title}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-textSecondary line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <div className="mb-3 sm:mb-4 flex items-center flex-wrap gap-2">
        {typeInfo && (
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-semibold ${typeInfo.color}`}
          >
            {typeInfo.icon} {t(typeInfo.labelKey)}
          </span>
        )}
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-semibold ${difficultyColors[challenge.difficulty]}`}
        >
          {t(`ramadan.difficulty.${challenge.difficulty}`)}
        </span>
        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-textPrimary">
          {t(`ramadan.category.${challenge.category}`)}
        </span>
      </div>

      {isEnrolled && (
        <div className="mb-3 sm:mb-4">
          <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-textSecondary">
              {t("ramadan.progress.label")}
            </span>
            <span className="font-semibold text-primary">
              {formatNumber(progress, language)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-sm">
        <span className="text-xl sm:text-2xl">⭐</span>
        <span className="font-semibold text-textPrimary">
          {formatNumber(challenge.xp_reward, language)} XP
        </span>
      </div>

      {!isEnrolled && onEnroll && (
        <button
          onClick={onEnroll}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm sm:text-base font-semibold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg"
        >
          {t("ramadan.enroll")}
        </button>
      )}

      {isEnrolled && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
          <span className="text-lg sm:text-xl">✓</span>
          <span className="text-sm sm:text-base font-semibold text-primary">
            {t("ramadan.enrolled")}
          </span>
        </div>
      )}
    </div>
  );
};
