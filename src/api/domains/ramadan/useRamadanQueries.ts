import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/contexts/queryClient";
import {
  getAllChallenges,
  getChallengesByCategory,
  getChallengesByDifficulty,
  getChallengeById,
  getUserChallenges,
  getUserChallengesByStatus,
  enrollInChallenge,
  updateChallengeProgress,
  getDailyLog,
  getUserDailyLogs,
  logDailyProgress,
  getAllBadges,
  getUserBadges,
  awardBadge,
  toggleBadgeShowcase,
  getUserRamadanProfile,
  createOrUpdateUserRamadanProfile,
  updateUserXP,
  getLeaderboard,
  getUserLeaderboardRank,
  getUserReflections,
  createReflection,
  updateReflection,
  deleteReflection,
  getAllTeams,
  getTeamByCode,
  getUserTeam,
  createTeam,
  joinTeam,
  leaveTeam,
  getTeamMembers,
} from "./ramadan-queries";
import type {
  EnrollChallengeRequest,
  UpdateChallengeProgressRequest,
  CreateReflectionRequest,
  CreateTeamRequest,
  JoinTeamRequest,
  RamadanReflection,
  ChallengeStatus,
} from "./ramadan.types";

// ============================================
// CHALLENGES QUERIES
// ============================================

export const useAllChallengesQuery = () => {
  return useQuery({
    queryKey: ["ramadan-challenges"],
    queryFn: getAllChallenges,
  });
};

export const useChallengesByCategoryQuery = (category: string) => {
  return useQuery({
    queryKey: ["ramadan-challenges", "category", category],
    queryFn: () => getChallengesByCategory(category),
    enabled: !!category,
  });
};

export const useChallengesByDifficultyQuery = (difficulty: string) => {
  return useQuery({
    queryKey: ["ramadan-challenges", "difficulty", difficulty],
    queryFn: () => getChallengesByDifficulty(difficulty),
    enabled: !!difficulty,
  });
};

export const useChallengeByIdQuery = (challengeId: string | undefined) => {
  return useQuery({
    queryKey: ["ramadan-challenge", challengeId],
    queryFn: () => (challengeId ? getChallengeById(challengeId) : null),
    enabled: !!challengeId,
  });
};

// ============================================
// USER CHALLENGES QUERIES
// ============================================

export const useUserChallengesQuery = (
  userId: string | undefined,
  ramadanYear: number,
) => {
  return useQuery({
    queryKey: ["user-ramadan-challenges", userId, ramadanYear],
    queryFn: () => (userId ? getUserChallenges(userId, ramadanYear) : []),
    enabled: !!userId,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    staleTime: 0, // ALWAYS consider stale
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useUserChallengesByStatusQuery = (
  userId: string | undefined,
  ramadanYear: number,
  status: ChallengeStatus,
) => {
  return useQuery({
    queryKey: ["user-ramadan-challenges", userId, ramadanYear, status],
    queryFn: () =>
      userId ? getUserChallengesByStatus(userId, ramadanYear, status) : [],
    enabled: !!userId,
  });
};

export const useEnrollChallengeMutation = (ramadanYear: number) => {
  return useMutation({
    mutationFn: (request: EnrollChallengeRequest) => enrollInChallenge(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "user-ramadan-challenges",
          variables.user_id,
          variables.ramadan_year,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-ramadan-profile", variables.user_id, ramadanYear],
      });
    },
  });
};

export const useUpdateChallengeProgressMutation = (ramadanYear: number) => {
  return useMutation({
    mutationFn: (request: UpdateChallengeProgressRequest) =>
      updateChallengeProgress(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "user-ramadan-challenges",
          variables.user_id,
          variables.ramadan_year,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-ramadan-profile", variables.user_id, ramadanYear],
      });
      queryClient.invalidateQueries({
        queryKey: ["ramadan-daily-log", variables.user_id],
      });
    },
  });
};

// ============================================
// DAILY LOG QUERIES
// ============================================

export const useDailyLogQuery = (userId: string | undefined, date: string) => {
  return useQuery({
    queryKey: ["ramadan-daily-log", userId, date],
    queryFn: () => (userId ? getDailyLog(userId, date) : []),
    enabled: !!userId && !!date,
  });
};

export const useUserDailyLogsQuery = (
  userId: string | undefined,
  ramadanYear: number,
) => {
  return useQuery({
    queryKey: ["ramadan-daily-log", userId, ramadanYear],
    queryFn: () => (userId ? getUserDailyLogs(userId, ramadanYear) : []),
    enabled: !!userId,
  });
};

export const useLogDailyProgressMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: logDailyProgress,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["ramadan-daily-log", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-ramadan-challenges", userId, data?.ramadan_year],
      });
    },
  });
};

// ============================================
// BADGES QUERIES
// ============================================

export const useAllBadgesQuery = () => {
  return useQuery({
    queryKey: ["badges"],
    queryFn: getAllBadges,
  });
};

export const useUserBadgesQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user-badges", userId],
    queryFn: () => (userId ? getUserBadges(userId) : []),
    enabled: !!userId,
  });
};

export const useAwardBadgeMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: ({
      badgeId,
      challengeId,
      ramadanYear,
    }: {
      badgeId: string;
      challengeId?: string;
      ramadanYear?: number;
    }) => {
      if (!userId) throw new Error("User must be logged in");
      return awardBadge(userId, badgeId, challengeId, ramadanYear);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user-badges", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-ramadan-profile", userId, variables.ramadanYear],
      });
    },
  });
};

export const useToggleBadgeShowcaseMutation = (userId: string | undefined) => {
  return useMutation({
    mutationFn: ({
      badgeId,
      isShowcased,
    }: {
      badgeId: string;
      isShowcased: boolean;
    }) => {
      if (!userId) throw new Error("User must be logged in");
      return toggleBadgeShowcase(userId, badgeId, isShowcased);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-badges", userId],
      });
    },
  });
};

// ============================================
// USER RAMADAN PROFILE QUERIES
// ============================================

export const useUserRamadanProfileQuery = (
  userId: string | undefined,
  ramadanYear: number,
) => {
  return useQuery({
    queryKey: ["user-ramadan-profile", userId, ramadanYear],
    queryFn: () =>
      userId ? getUserRamadanProfile(userId, ramadanYear) : null,
    enabled: !!userId,
    refetchInterval: 5000, // Auto-refresh every 5 seconds (FASTER)
    refetchIntervalInBackground: false,
    staleTime: 0, // ALWAYS consider stale - force refetch
    refetchOnMount: true, // ALWAYS refetch on mount
    refetchOnWindowFocus: true, // Refetch when window focused
  });
};

export const useUpdateUserRamadanProfileMutation = (ramadanYear: number) => {
  return useMutation({
    mutationFn: createOrUpdateUserRamadanProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user-ramadan-profile", data?.user_id, ramadanYear],
      });
    },
  });
};

export const useUpdateUserXPMutation = (
  userId: string | undefined,
  ramadanYear: number,
) => {
  return useMutation({
    mutationFn: (xpToAdd: number) => {
      if (!userId) throw new Error("User must be logged in");
      return updateUserXP(userId, ramadanYear, xpToAdd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-ramadan-profile", userId, ramadanYear],
      });
      queryClient.invalidateQueries({
        queryKey: ["ramadan-leaderboard", ramadanYear],
      });
    },
  });
};

// ============================================
// LEADERBOARD QUERIES
// ============================================

export const useLeaderboardQuery = (
  ramadanYear: number,
  leaderboardType: string = "global",
  limit: number = 100,
) => {
  return useQuery({
    queryKey: ["ramadan-leaderboard", ramadanYear, leaderboardType, limit],
    queryFn: () => getLeaderboard(ramadanYear, leaderboardType, limit),
  });
};

export const useUserLeaderboardRankQuery = (
  userId: string | undefined,
  ramadanYear: number,
  leaderboardType: string = "global",
) => {
  return useQuery({
    queryKey: [
      "user-ramadan-leaderboard-rank",
      userId,
      ramadanYear,
      leaderboardType,
    ],
    queryFn: () =>
      userId
        ? getUserLeaderboardRank(userId, ramadanYear, leaderboardType)
        : null,
    enabled: !!userId,
  });
};

// ============================================
// REFLECTIONS QUERIES
// ============================================

export const useUserReflectionsQuery = (
  userId: string | undefined,
  ramadanYear: number,
) => {
  return useQuery({
    queryKey: ["ramadan-reflections", userId, ramadanYear],
    queryFn: () => (userId ? getUserReflections(userId, ramadanYear) : []),
    enabled: !!userId,
  });
};

export const useCreateReflectionMutation = (
  userId: string | undefined,
  ramadanYear: number,
) => {
  return useMutation({
    mutationFn: (request: CreateReflectionRequest) => createReflection(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ramadan-reflections", userId, ramadanYear],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-ramadan-profile", userId, ramadanYear],
      });
    },
  });
};

export const useUpdateReflectionMutation = (
  userId: string | undefined,
  ramadanYear: number,
) => {
  return useMutation({
    mutationFn: ({
      reflectionId,
      updates,
    }: {
      reflectionId: string;
      updates: Partial<RamadanReflection>;
    }) => updateReflection(reflectionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ramadan-reflections", userId, ramadanYear],
      });
    },
  });
};

export const useDeleteReflectionMutation = (
  userId: string | undefined,
  ramadanYear: number,
) => {
  return useMutation({
    mutationFn: (reflectionId: string) => deleteReflection(reflectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ramadan-reflections", userId, ramadanYear],
      });
    },
  });
};

// ============================================
// TEAMS QUERIES
// ============================================

export const useAllTeamsQuery = (ramadanYear: number) => {
  return useQuery({
    queryKey: ["ramadan-teams", ramadanYear],
    queryFn: () => getAllTeams(ramadanYear),
  });
};

export const useTeamByCodeQuery = (teamCode: string | undefined) => {
  return useQuery({
    queryKey: ["ramadan-team", teamCode],
    queryFn: () => (teamCode ? getTeamByCode(teamCode) : null),
    enabled: !!teamCode,
  });
};

export const useUserTeamQuery = (
  userId: string | undefined,
  ramadanYear: number,
) => {
  return useQuery({
    queryKey: ["user-ramadan-team", userId, ramadanYear],
    queryFn: () => (userId ? getUserTeam(userId, ramadanYear) : null),
    enabled: !!userId,
  });
};

export const useCreateTeamMutation = (ramadanYear: number) => {
  return useMutation({
    mutationFn: (request: CreateTeamRequest) => createTeam(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ramadan-teams", ramadanYear],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-ramadan-team", variables.creator_id, ramadanYear],
      });
    },
  });
};

export const useJoinTeamMutation = (
  userId: string | undefined,
  ramadanYear: number,
) => {
  return useMutation({
    mutationFn: (request: JoinTeamRequest) => joinTeam(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-ramadan-team", userId, ramadanYear],
      });
      queryClient.invalidateQueries({
        queryKey: ["ramadan-teams", ramadanYear],
      });
    },
  });
};

export const useLeaveTeamMutation = (
  userId: string | undefined,
  ramadanYear: number,
) => {
  return useMutation({
    mutationFn: (teamId: string) => {
      if (!userId) throw new Error("User must be logged in");
      return leaveTeam(userId, teamId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-ramadan-team", userId, ramadanYear],
      });
      queryClient.invalidateQueries({
        queryKey: ["ramadan-teams", ramadanYear],
      });
    },
  });
};

export const useTeamMembersQuery = (teamId: string | undefined) => {
  return useQuery({
    queryKey: ["ramadan-team-members", teamId],
    queryFn: () => (teamId ? getTeamMembers(teamId) : []),
    enabled: !!teamId,
  });
};
