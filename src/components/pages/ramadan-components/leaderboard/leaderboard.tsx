import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLeaderboardQuery } from "@/api/domains/ramadan/useRamadanQueries";
import type { LeaderboardType } from "@/api/domains/ramadan/ramadan.types";

interface LeaderboardProps {
  ramadanYear: number;
  currentUserId?: string;
}

export const Leaderboard = ({
  ramadanYear,
  currentUserId,
}: LeaderboardProps) => {
  const { t } = useTranslation();
  const [leaderboardType, setLeaderboardType] =
    useState<LeaderboardType>("global");

  const { data: leaderboard = [], isLoading } = useLeaderboardQuery(
    ramadanYear,
    leaderboardType,
    100,
  );

  const leaderboardTypes: LeaderboardType[] = ["global", "friends", "country"];

  const getRankEmoji = (rank: number): string => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "";
  };

  const getRankColor = (rank: number): string => {
    if (rank === 1)
      return "border border-primary bg-primary/10 text-textPrimary";
    if (rank === 2)
      return "border border-border bg-surface text-textPrimary";
    if (rank === 3)
      return "border border-primary/50 bg-primary/5 text-textPrimary";
    return "border border-border bg-surface";
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-textPrimary">
        🏆 {t("ramadan.leaderboard.title")}
      </h2>

      <div className="mb-6 flex gap-2">
        {leaderboardTypes.map((type) => (
          <button
            key={type}
            onClick={() => setLeaderboardType(type)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              leaderboardType === type
                ? "bg-primary text-white shadow-md"
                : "border border-border bg-background text-textSecondary hover:border-primary hover:text-primary"
            }`}
          >
            {t(`ramadan.leaderboard.${type}`)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-textSecondary">
          {t("common.loading")}...
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-textSecondary">
            {t("ramadan.leaderboard.noData")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry) => {
            const isCurrentUser = entry.user_id === currentUserId;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between rounded-lg p-4 transition-all ${getRankColor(entry.rank)} ${
                  isCurrentUser
                    ? "ring-2 ring-primary"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-lg font-bold text-textPrimary">
                    {getRankEmoji(entry.rank) || entry.rank}
                  </div>

                  <div>
                    <p className="font-semibold text-textPrimary">
                      {isCurrentUser ? (
                        <span className="flex items-center gap-2">
                          {t("ramadan.leaderboard.you")}
                          <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                            {t("ramadan.leaderboard.you")}
                          </span>
                        </span>
                      ) : (
                        `User ${entry.user_id.slice(0, 8)}`
                      )}
                    </p>
                    <p className="text-sm text-textSecondary">
                      {entry.challenges_completed}{" "}
                      {t("ramadan.leaderboard.challengesCompleted")}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-textPrimary">
                    {entry.total_xp.toLocaleString()}
                  </p>
                  <p className="text-xs text-textSecondary">
                    XP
                  </p>
                  {entry.ramadan_streak > 0 && (
                    <div className="mt-1 flex items-center justify-end gap-1 text-xs text-primary">
                      <span>🔥</span>
                      <span>{entry.ramadan_streak}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
