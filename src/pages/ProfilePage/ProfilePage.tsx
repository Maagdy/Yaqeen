import { useEffect } from "react";
import { useAuth } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import {
  useProfileQuery,
  useUserStatsQuery,
  useFavoriteRecitersQuery,
  useFavoriteSurahsQuery,
  useFavoriteJuzsQuery,
  useFavoriteAyahsQuery,
} from "@/api/domains/user";
import { Loading } from "@/components/ui/loading";
import {
  ProfileHeader,
  ProfileForm,
  ProfileFavorites,
  ProfileStats,
} from "@/components/pages";

function ProfilePage() {
  const { user, session, loading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading: isLoadingProfile } = useProfileQuery(
    user?.id,
  );
  const { data: stats } = useUserStatsQuery(user?.id);
  const { data: favoriteReciters } = useFavoriteRecitersQuery(user?.id);
  const { data: favoriteSurahs } = useFavoriteSurahsQuery(user?.id);
  const { data: favoriteJuzs } = useFavoriteJuzsQuery(user?.id);
  const { data: favoriteAyahs } = useFavoriteAyahsQuery(user?.id);

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
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <ProfileHeader
          displayName={displayName}
          email={user.email || null}
          initials={initials}
          createdAt={user.created_at || null}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content - Left Column (Profile Form & Favorites) */}
          <div className="md:col-span-2 space-y-6">
            <ProfileForm
              firstName={profile?.first_name || null}
              lastName={profile?.last_name || null}
              email={user.email}
              userId={user.id}
            />

            <ProfileFavorites
              favoriteReciters={favoriteReciters}
              favoriteSurahs={favoriteSurahs}
              favoriteJuzs={favoriteJuzs}
              favoriteAyahs={favoriteAyahs}
            />
          </div>

          {/* Sidebar - Right Column (Stats) */}
          <div className="space-y-6">
            <ProfileStats currentStreak={stats?.streak?.current_streak || 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
