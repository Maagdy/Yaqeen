import { useUserRamadanProfileQuery, useUserChallengesQuery } from '@/api/domains/ramadan/useRamadanQueries';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks';
import { formatNumber } from '@/utils/numbers';
import { getCurrentRamadanYear } from '@/utils/ramadan-dates';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { UserChallengeWithDetails } from '@/api/domains/ramadan/ramadan.types';

export const ReadingProgressIndicator = () => {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const { user } = useAuth();
  const currentYear = getCurrentRamadanYear();
  const isRTL = i18n.language === 'ar';

  const { data: profile } = useUserRamadanProfileQuery(
    user?.id,
    currentYear
  );

  const { data: userChallenges = [] } = useUserChallengesQuery(
    user?.id,
    currentYear
  );

  // Find the latest in-progress challenge to display
  const activeChallenge = useMemo(() => {
    if (!userChallenges || userChallenges.length === 0) return null;

    // Filter to only in-progress challenges
    const inProgressChallenges = userChallenges.filter(
      (ch: UserChallengeWithDetails) => ch.status === 'in_progress'
    );

    if (inProgressChallenges.length === 0) return null;

    // Sort by last_updated_at (most recent first)
    const sorted = [...inProgressChallenges].sort((a, b) => {
      const dateA = new Date(a.last_updated_at || 0).getTime();
      const dateB = new Date(b.last_updated_at || 0).getTime();
      return dateB - dateA; // Most recent first
    });

    return sorted[0];
  }, [userChallenges]);

  if (!user || !profile) return null;

  // If there's an active challenge, show it
  if (activeChallenge) {
    const progress = activeChallenge.progress || {};
    const current = progress.current || 0;
    const target = progress.target || 1;
    const progressPercentage = Math.min((current / target) * 100, 100);

    const challengeName = isRTL
      ? activeChallenge.challenge?.title_ar || activeChallenge.challenge?.title_en
      : activeChallenge.challenge?.title_en;

    // Get progress message based on challenge type
    const getProgressMessage = () => {
      if (activeChallenge.challenge?.challenge_type === 'daily') {
        const daysCompleted = (progress.days_completed as number[] | undefined)?.length || 0;
        return `${formatNumber(daysCompleted, language)} / ${formatNumber(target, language)} ${t('common.days')}`;
      } else if (activeChallenge.challenge?.category === 'quran') {
        const unit = (activeChallenge.challenge.config as any)?.unit;
        if (unit === 'pages') {
          return `${formatNumber(current, language)} / ${formatNumber(target, language)} ${t('ramadan.progress.pages')}`;
        } else if (unit === 'juz') {
          return `${formatNumber(current, language)} / ${formatNumber(target, language)} Juz`;
        }
      } else if (activeChallenge.challenge?.category === 'listening') {
        return `${formatNumber(current, language)} / ${formatNumber(target, language)} ${t('common.minutes')}`;
      }
      return `${formatNumber(Math.round(progressPercentage), language)}%`;
    };

    const getMessage = () => {
      if (progressPercentage === 0) return t('ramadan.progress.start');
      if (progressPercentage < 30) return t('ramadan.progress.keepGoing');
      if (progressPercentage < 70) return t('ramadan.progress.almostHalfway');
      if (progressPercentage < 100) return t('ramadan.progress.almostThere');
      return t('ramadan.progress.goalComplete');
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg p-4 mb-4 border-2 border-primary/30 shadow-md"
      >
        {/* Header - Active Challenge */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeChallenge.challenge?.icon || '🎯'}</span>
            <h3 className="text-sm font-bold text-textPrimary truncate max-w-[200px]">
              {challengeName}
            </h3>
          </div>
          <span className="text-xs font-semibold text-primary bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
            {getProgressMessage()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full relative"
          >
            {progressPercentage > 10 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white drop-shadow">
                  {formatNumber(Math.round(progressPercentage), language)}%
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Motivational Message */}
        <p className="text-xs text-textSecondary text-center mb-2">
          {getMessage()}
        </p>

        {/* Mini Stats */}
        <div className="flex items-center justify-around pt-2 border-t border-border/50">
          <div className="text-center">
            <p className="text-base font-bold text-primary">{formatNumber(profile.challenges_completed, language)}</p>
            <p className="text-[10px] text-textSecondary">{t('ramadan.progress.challengesDone')}</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-primary">{formatNumber(profile.ramadan_streak, language)}</p>
            <p className="text-[10px] text-textSecondary">{t('ramadan.progress.dayStreak')}</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-primary">{formatNumber(profile.total_xp, language)}</p>
            <p className="text-[10px] text-textSecondary">{t('ramadan.progress.xp')}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Fallback to daily goal if no active challenge
  const dailyGoalPages = profile.daily_goal_pages || 10;
  const pagesReadToday = profile.pages_read_today || 0;
  const progressPercentage = Math.min((pagesReadToday / dailyGoalPages) * 100, 100);

  // Motivational messages based on progress
  const getMessage = () => {
    if (progressPercentage === 0) return t('ramadan.progress.start');
    if (progressPercentage < 30) return t('ramadan.progress.keepGoing');
    if (progressPercentage < 70) return t('ramadan.progress.almostHalfway');
    if (progressPercentage < 100) return t('ramadan.progress.almostThere');
    return t('ramadan.progress.goalComplete');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-lg p-4 mb-4 border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-textPrimary">
          {t('ramadan.progress.todayReading')}
        </h3>
        <span className="text-xs text-textSecondary">
          {formatNumber(pagesReadToday, language)} / {formatNumber(dailyGoalPages, language)} {t('ramadan.progress.pages')}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-primary h-2 rounded-full"
        />
      </div>

      {/* Motivational Message */}
      <p className="text-xs text-textSecondary text-center">
        {getMessage()}
      </p>

      {/* Mini Stats */}
      <div className="flex items-center justify-around mt-3 pt-3 border-t border-border">
        <div className="text-center">
          <p className="text-lg font-bold text-primary">{formatNumber(profile.challenges_completed, language)}</p>
          <p className="text-xs text-textSecondary">{t('ramadan.progress.challengesDone')}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-primary">{formatNumber(profile.ramadan_streak, language)}</p>
          <p className="text-xs text-textSecondary">{t('ramadan.progress.dayStreak')}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-primary">{formatNumber(profile.total_xp, language)}</p>
          <p className="text-xs text-textSecondary">{t('ramadan.progress.xp')}</p>
        </div>
      </div>
    </motion.div>
  );
};
