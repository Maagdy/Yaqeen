import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalFireDepartment, MenuBook, Headphones, Speed, TrendingUp } from "@mui/icons-material";
import type { ProfileStatsProps } from "./profile-stats.types";
import { useUserStatsQuery } from "@/api/domains/user";
import { useUserRamadanProfileQuery } from "@/api/domains/ramadan/useRamadanQueries";
import { getCurrentRamadanYear, getRamadanStatus } from "@/utils/ramadan-dates";
import { useAuth } from "@/hooks";

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  currentStreak,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: stats } = useUserStatsQuery(user?.id);

  const currentRamadanYear = getCurrentRamadanYear();
  const ramadanStatus = getRamadanStatus();
  const isRamadan = ramadanStatus.status === 'during';

  const { data: ramadanProfile } = useUserRamadanProfileQuery(
    isRamadan ? user?.id : undefined,
    currentRamadanYear
  );

  // Calculate total pages read from daily progress
  const totalPagesRead = stats?.progress?.reduce((sum, day) => sum + (day.pages_read || 0), 0) || 0;
  const totalMinutesListened = stats?.progress?.reduce((sum, day) => sum + (day.minutes_listened || 0), 0) || 0;

  // Calculate average reading speed from recent sessions
  const recentSessions = stats?.progress?.filter(day => day.average_reading_speed && day.average_reading_speed > 0) || [];
  const avgReadingSpeed = recentSessions.length > 0
    ? recentSessions.reduce((sum, day) => sum + (day.average_reading_speed || 0), 0) / recentSessions.length
    : 0;

  // Calculate total reading time in hours
  const totalReadingTimeHours = (stats?.progress?.reduce((sum, day) => sum + (day.reading_time_seconds || 0), 0) || 0) / 3600;

  return (
    <div className="space-y-4">
      {/* General Activity Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("profile.activity")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
              <LocalFireDepartment />
            </div>
            <div className="flex-1">
              <p className="text-sm text-textSecondary">
                {t("profile.current_streak")}
              </p>
              <p className="text-xl font-bold text-textPrimary">
                {currentStreak} {t("common.days")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <MenuBook />
            </div>
            <div className="flex-1">
              <p className="text-sm text-textSecondary">
                {t("profile.total_pages_read")}
              </p>
              <p className="text-xl font-bold text-textPrimary">
                {totalPagesRead.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <Headphones />
            </div>
            <div className="flex-1">
              <p className="text-sm text-textSecondary">
                {t("profile.total_listening")}
              </p>
              <p className="text-xl font-bold text-textPrimary">
                {Math.floor(totalMinutesListened / 60)}h {totalMinutesListened % 60}m
              </p>
            </div>
          </div>

          {avgReadingSpeed > 0 && (
            <div className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <Speed />
              </div>
              <div className="flex-1">
                <p className="text-sm text-textSecondary">
                  {t("profile.reading_speed")}
                </p>
                <p className="text-xl font-bold text-textPrimary">
                  {avgReadingSpeed.toFixed(1)} {t("profile.pages_per_min")}
                </p>
              </div>
            </div>
          )}

          {totalReadingTimeHours > 0 && (
            <div className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <TrendingUp />
              </div>
              <div className="flex-1">
                <p className="text-sm text-textSecondary">
                  {t("profile.total_reading_time")}
                </p>
                <p className="text-xl font-bold text-textPrimary">
                  {totalReadingTimeHours.toFixed(1)}h
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ramadan Stats (Only show during Ramadan season) */}
      {isRamadan && ramadanProfile && (
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🌙 {t("ramadan.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-background/60 rounded-lg border border-border">
                <p className="text-xs text-textSecondary mb-1">{t("ramadan.stats.level")}</p>
                <p className="text-2xl font-bold text-primary">{ramadanProfile.level}</p>
              </div>
              <div className="p-3 bg-background/60 rounded-lg border border-border">
                <p className="text-xs text-textSecondary mb-1">{t("ramadan.stats.totalXP")}</p>
                <p className="text-2xl font-bold text-primary">{ramadanProfile.total_xp}</p>
              </div>
              <div className="p-3 bg-background/60 rounded-lg border border-border">
                <p className="text-xs text-textSecondary mb-1">{t("ramadan.stats.streak")}</p>
                <p className="text-2xl font-bold text-orange-500">{ramadanProfile.ramadan_streak}</p>
              </div>
              <div className="p-3 bg-background/60 rounded-lg border border-border">
                <p className="text-xs text-textSecondary mb-1">{t("ramadan.badges.totalBadges")}</p>
                <p className="text-2xl font-bold text-yellow-500">{ramadanProfile.badges_earned}</p>
              </div>
            </div>

            <div className="p-3 bg-background/60 rounded-lg border border-primary/30">
              <p className="text-xs text-textSecondary mb-1">{t("ramadan.progress.todayReading")}</p>
              <p className="text-xl font-bold text-textPrimary">
                {ramadanProfile.pages_read_today || 0} / {ramadanProfile.daily_goal_pages || 10} {t("ramadan.progress.pages")}
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      ((ramadanProfile.pages_read_today || 0) / (ramadanProfile.daily_goal_pages || 10)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-background/60 rounded-lg border border-border">
                <p className="text-xs text-textSecondary mb-1">{t("ramadan.stats.completed")}</p>
                <p className="text-xl font-bold text-green-600">{ramadanProfile.challenges_completed}</p>
              </div>
              <div className="p-3 bg-background/60 rounded-lg border border-border">
                <p className="text-xs text-textSecondary mb-1">{t("ramadan.stats.inProgress")}</p>
                <p className="text-xl font-bold text-blue-600">{ramadanProfile.challenges_in_progress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
