import { useTranslation } from "react-i18next";
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
  const isRTL = i18n.language === "ar";

  const title = isRTL ? challenge.title_ar : challenge.title_en;
  const description = isRTL
    ? challenge.description_ar
    : challenge.description_en;

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const categoryIcons = {
    quran: "📖",
    prayer: "🕌",
    listening: "🎧",
    reflection: "✍️",
    community: "👥",
    charity: "💰",
  };

  return (
    <div
      className="group relative overflow-hidden rounded-xl border-2 border-border bg-surface p-6 transition-all hover:shadow-lg hover:border-primary"
      style={{
        borderTopColor: challenge.color || "var(--color-primary)",
        borderTopWidth: "4px",
      }}
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="text-4xl">{challenge.icon || categoryIcons[challenge.category]}</span>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-textPrimary">
            {title}
          </h3>
          <p className="mt-1 text-sm text-textSecondary">
            {description}
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyColors[challenge.difficulty]}`}
        >
          {t(`ramadan.difficulty.${challenge.difficulty}`)}
        </span>
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-textPrimary">
          {t(`ramadan.category.${challenge.category}`)}
        </span>
      </div>

      {isEnrolled && (
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-textSecondary">
              {t("ramadan.progress")}
            </span>
            <span className="font-semibold text-primary">
              {progress}%
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

      <div className="mb-4 flex items-center gap-2 text-sm">
        <span className="text-2xl">⭐</span>
        <span className="font-semibold text-textPrimary">
          {challenge.xp_reward} XP
        </span>
      </div>

      {!isEnrolled && onEnroll && (
        <button
          onClick={onEnroll}
          className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg"
        >
          {t("ramadan.enroll")}
        </button>
      )}

      {isEnrolled && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
          <span className="text-xl">✓</span>
          <span className="font-semibold text-primary">
            {t("ramadan.enrolled")}
          </span>
        </div>
      )}
    </div>
  );
};
