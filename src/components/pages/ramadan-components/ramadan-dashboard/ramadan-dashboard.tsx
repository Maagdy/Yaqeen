import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAuth, useLanguage } from "@/hooks";
import { formatNumber } from "@/utils/numbers";
import { getCurrentRamadanYear, getRamadanStatus } from "@/utils/ramadan-dates";
import {
  useAllChallengesQuery,
  useUserChallengesQuery,
  useUserRamadanProfileQuery,
  useEnrollChallengeMutation,
} from "@/api/domains/ramadan/useRamadanQueries";
import { ChallengeCard } from "../challenge-card/challenge-card";
import { UserStatsCard } from "../user-stats-card/user-stats-card";
import { BadgeShowcase } from "../badge-showcase/badge-showcase";
import { Loading } from "@/components/ui/loading/Loading";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import type { ChallengeDifficulty, ChallengeCategory } from "@/api/domains/ramadan/ramadan.types";

export const RamadanDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const [selectedType, setSelectedType] = useState<"all" | "instant" | "daily" | "special">("all");

  const currentRamadanYear = getCurrentRamadanYear();
  const ramadanStatus = getRamadanStatus();

  const {
    data: allChallenges = [],
    isLoading: challengesLoading,
    error: challengesError,
    refetch: refetchChallenges,
  } = useAllChallengesQuery();

  const {
    data: userChallenges = [],
    isLoading: userChallengesLoading,
    refetch: refetchUserChallenges,
  } = useUserChallengesQuery(
    user?.id,
    currentRamadanYear,
  );

  const {
    data: userProfile,
    isLoading: profileLoading,
    refetch: refetchUserProfile,
  } = useUserRamadanProfileQuery(
    user?.id,
    currentRamadanYear,
  );

  const handleRefresh = () => {
    refetchChallenges();
    refetchUserChallenges();
    refetchUserProfile();
    toast.info(t("ramadan.refreshing"));
  };

  const enrollMutation = useEnrollChallengeMutation(currentRamadanYear);

  const filteredChallenges = allChallenges.filter((challenge) => {
    const categoryMatch =
      selectedCategory === "all" || challenge.category === selectedCategory;
    const difficultyMatch =
      selectedDifficulty === "all" || challenge.difficulty === selectedDifficulty;

    // Type filter: instant = progressive/milestone, daily = daily, special = special
    const typeMatch =
      selectedType === "all" ||
      (selectedType === "instant" && (challenge.challenge_type === "progressive" || challenge.challenge_type === "milestone")) ||
      (selectedType === "daily" && challenge.challenge_type === "daily") ||
      (selectedType === "special" && challenge.challenge_type === "special");

    return categoryMatch && difficultyMatch && typeMatch;
  });

  const enrolledChallengeIds = new Set(
    userChallenges.map((uc) => uc.challenge_id),
  );

  const handleEnroll = (challengeId: string) => {
    if (!user?.id) {
      toast.warning(t("ramadan.loginRequired"));
      return;
    }

    enrollMutation.mutate(
      {
        user_id: user.id,
        challenge_id: challengeId,
        ramadan_year: currentRamadanYear,
      },
      {
        onSuccess: () => {
          toast.success(t("ramadan.enrollSuccess"));
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : t("ramadan.enrollError"));
        },
      }
    );
  };

  const calculateProgress = (challengeId: string): number => {
    const userChallenge = userChallenges.find(
      (uc) => uc.challenge_id === challengeId,
    );
    if (!userChallenge?.progress) return 0;

    const { current = 0, target = 1 } = userChallenge.progress;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const categories: Array<ChallengeCategory | "all"> = [
    "all",
    "quran",
    "prayer",
    "listening",
    "reflection",
    "community",
    "charity",
  ];

  const difficulties: Array<ChallengeDifficulty | "all"> = [
    "all",
    "easy",
    "medium",
    "hard",
  ];

  if (challengesLoading || (user && (userChallengesLoading || profileLoading))) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" message={t("ramadan.loadingChallenges")} />
      </div>
    );
  }

  if (challengesError) {
    return (
      <ErrorPage
        title={t("ramadan.errorTitle")}
        message={t("ramadan.errorMessage")}
        error={challengesError}
        showRetryButton
        onRetry={() => refetchChallenges()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 text-center px-4">
          <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary">
            🌙 {t("ramadan.title")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-textSecondary max-w-2xl mx-auto">
            {t("ramadan.subtitle")}
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
            <div className="inline-block rounded-lg bg-primary/10 px-4 sm:px-6 py-2">
              <p className="text-xs sm:text-sm font-semibold text-primary">
                {language === 'ar' && ramadanStatus.arabicMessage
                  ? ramadanStatus.arabicMessage
                  : ramadanStatus.message} • {currentRamadanYear}
              </p>
            </div>
            {user && (
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
              >
                🔄 {t("common.refresh")}
              </button>
            )}
          </div>
        </div>

        {user && (
          <div className="mb-6 sm:mb-8 grid gap-4 sm:gap-6 lg:grid-cols-2">
            <UserStatsCard
              profile={userProfile}
              userChallenges={userChallenges}
            />
            <BadgeShowcase userId={user.id} />
          </div>
        )}

        <div className="mb-6 rounded-xl border border-border bg-surface p-4 sm:p-6 shadow-sm">
          {/* Challenge Type Filter */}
          <div className="mb-4 sm:mb-6">
            <h3 className="mb-3 text-base sm:text-lg font-semibold text-textPrimary">
              {t("ramadan.filters.type")}
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType("all")}
                className={`rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition-all ${
                  selectedType === "all"
                    ? "bg-primary text-white shadow-md"
                    : "border border-border bg-background text-textSecondary hover:border-primary hover:text-primary"
                }`}
              >
                {t("ramadan.type.all")}
              </button>
              <button
                onClick={() => setSelectedType("instant")}
                className={`rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition-all ${
                  selectedType === "instant"
                    ? "bg-primary text-white shadow-md"
                    : "border border-border bg-background text-textSecondary hover:border-primary hover:text-primary"
                }`}
              >
                ⚡ {t("ramadan.type.instant")}
              </button>
              <button
                onClick={() => setSelectedType("daily")}
                className={`rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition-all ${
                  selectedType === "daily"
                    ? "bg-primary text-white shadow-md"
                    : "border border-border bg-background text-textSecondary hover:border-primary hover:text-primary"
                }`}
              >
                📅 {t("ramadan.type.daily")}
              </button>
              <button
                onClick={() => setSelectedType("special")}
                className={`rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition-all ${
                  selectedType === "special"
                    ? "bg-primary text-white shadow-md"
                    : "border border-border bg-background text-textSecondary hover:border-primary hover:text-primary"
                }`}
              >
                ✨ {t("ramadan.type.special")}
              </button>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <h3 className="mb-3 text-base sm:text-lg font-semibold text-textPrimary">
              {t("ramadan.filters.category")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-white shadow-md"
                      : "border border-border bg-background text-textSecondary hover:border-primary hover:text-primary"
                  }`}
                >
                  {t(`ramadan.category.${category}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-base sm:text-lg font-semibold text-textPrimary">
              {t("ramadan.filters.difficulty")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition-all ${
                    selectedDifficulty === difficulty
                      ? "bg-primary text-white shadow-md"
                      : "border border-border bg-background text-textSecondary hover:border-primary hover:text-primary"
                  }`}
                >
                  {t(`ramadan.difficulty.${difficulty}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-textPrimary">
            {t("ramadan.availableChallenges")} ({formatNumber(filteredChallenges.length, language)})
          </h2>

          {filteredChallenges.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface p-12 text-center shadow-sm">
              <p className="text-xl text-textSecondary">
                {t("ramadan.noChallenges")}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isEnrolled={enrolledChallengeIds.has(challenge.id)}
                  progress={calculateProgress(challenge.id)}
                  onEnroll={() => handleEnroll(challenge.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
