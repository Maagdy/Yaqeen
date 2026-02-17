import { useEffect } from "react";
import { useAuth } from "@/hooks";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import { useProfileQuery, useUserStatsQuery } from "@/api/domains/user";
import { useUserRamadanProfileQuery } from "@/api/domains/ramadan/useRamadanQueries";
import { getCurrentRamadanYear, getRamadanStatus } from "@/utils/ramadan-dates";
import { Loading } from "@/components/ui/loading";
import { ProfileHeader, ProfileForm, ProfileStats } from "@/components/pages";
import { SEO, SEO_CONFIG } from "@/components/seo";
import { useLanguage } from "@/hooks";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/utils/numbers";

function ProfilePage() {
  const { t } = useTranslation();
  const { user, session, loading, isLoggedIn } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const seoConfig = SEO_CONFIG.profile[language as "en" | "ar"];

  const { data: profile, isLoading: isLoadingProfile } = useProfileQuery(
    user?.id,
  );
  const { data: stats } = useUserStatsQuery(user?.id);

  // Ramadan data
  const currentRamadanYear = getCurrentRamadanYear();
  const ramadanStatus = getRamadanStatus();
  const isRamadan = ramadanStatus.status === 'during';

  const { data: ramadanProfile } = useUserRamadanProfileQuery(
    isRamadan ? user?.id : undefined,
    currentRamadanYear
  );

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate(ROUTES.AUTH);
    }
  }, [isLoggedIn, loading, navigate]);

  if (loading || !user || !session || isLoadingProfile) {
    return <Loading />;
  }

  const displayName =
    profile?.first_name || profile?.last_name
      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
      : user.email?.split("@")[0] || "User";

  const initials =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
      : user.email?.[0].toUpperCase() || "U";

  return (
    <>
      <SEO {...seoConfig} />
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <ProfileHeader
            displayName={displayName}
            email={user.email || null}
            initials={initials}
            createdAt={user.created_at || null}
          />

          {/* Ramadan Banner (only show during Ramadan) */}
          {isRamadan && ramadanProfile && (
            <Link
              to={ROUTES.RAMADAN}
              className="block w-full p-4 sm:p-6 rounded-xl border-2 border-primary/50 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 transition-all shadow-md hover:shadow-lg"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">
                    🌙 {t("ramadan.title")} {currentRamadanYear}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-textSecondary">
                    <span>Level {formatNumber(ramadanProfile.level, language)}</span>
                    <span>•</span>
                    <span>{formatNumber(ramadanProfile.total_xp, language)} XP</span>
                    <span>•</span>
                    <span>{formatNumber(ramadanProfile.challenges_completed, language)} {t("ramadan.stats.completed")}</span>
                  </div>
                </div>
                <div className="text-primary font-semibold text-sm">
                  {t("ramadan.viewDashboard")} →
                </div>
              </div>
            </Link>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <ProfileForm
                firstName={profile?.first_name || null}
                lastName={profile?.last_name || null}
                email={user.email}
                userId={user.id}
              />
            </div>

            <div className="space-y-6">
              <ProfileStats
                currentStreak={stats?.streak?.current_streak || 0}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
