import { useTranslation } from "react-i18next";
import { useUserBadgesQuery } from "@/api/domains/ramadan/useRamadanQueries";

interface BadgeShowcaseProps {
  userId: string;
}

export const BadgeShowcase = ({ userId }: BadgeShowcaseProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { data: userBadges = [], isLoading } = useUserBadgesQuery(userId);

  const tierColors = {
    bronze: "from-orange-600 to-orange-800",
    silver: "from-gray-400 to-gray-600",
    gold: "from-yellow-400 to-yellow-600",
    platinum: "from-purple-400 to-purple-600",
    special: "from-pink-400 to-pink-600",
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-textSecondary">{t("common.loading")}...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-6 shadow-sm">
      <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-textPrimary">
        {t("ramadan.badges.title")}
      </h2>

      {userBadges.length === 0 ? (
        <div className="py-8 sm:py-12 text-center">
          <div className="mb-4 text-4xl sm:text-6xl opacity-50">🏅</div>
          <p className="text-sm sm:text-base text-textSecondary">
            {t("ramadan.badges.noBadges")}
          </p>
          <p className="mt-2 text-xs sm:text-sm text-textSecondary">
            {t("ramadan.badges.completeChallenges")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 sm:grid-cols-4 lg:grid-cols-5">
          {userBadges.map((userBadge) => {
            const badge = userBadge.badge;
            const title = isRTL ? badge.title_ar : badge.title_en;
            const description = isRTL
              ? badge.description_ar
              : badge.description_en;

            return (
              <div
                key={userBadge.id}
                className="group relative flex flex-col items-center"
              >
                <div
                  className={`relative mb-2 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br ${tierColors[badge.tier]} shadow-lg transition-transform hover:scale-110`}
                >
                  <span className="text-2xl sm:text-3xl">{badge.icon}</span>

                  {userBadge.is_showcased && (
                    <div className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                      ⭐
                    </div>
                  )}
                </div>

                <p className="text-center text-[10px] sm:text-xs font-semibold text-textPrimary line-clamp-2">
                  {title}
                </p>

                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-40 sm:w-48 -translate-x-1/2 rounded-lg border border-border bg-surface p-2 sm:p-3 text-center text-xs opacity-0 shadow-lg transition-opacity group-hover:block group-hover:opacity-100">
                  <p className="mb-1 font-bold text-textPrimary">{title}</p>
                  <p className="text-textSecondary">{description}</p>
                  <p className="mt-2 text-textSecondary">
                    {t("ramadan.badges.earnedOn")}:{" "}
                    {new Date(userBadge.earned_at).toLocaleDateString(
                      isRTL ? "ar" : "en",
                    )}
                  </p>

                  <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-border"></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {userBadges.length > 0 && (
        <div className="mt-4 sm:mt-6 rounded-lg border border-border bg-background p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-textSecondary">
              {t("ramadan.badges.totalBadges")}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-textPrimary">
              {userBadges.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
