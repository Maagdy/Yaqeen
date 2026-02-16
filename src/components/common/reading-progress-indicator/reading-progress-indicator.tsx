import { useUserRamadanProfileQuery } from '@/api/domains/ramadan/useRamadanQueries';
import { useAuth } from '@/hooks/useAuth';
import { getCurrentRamadanYear } from '@/utils/ramadan-dates';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export const ReadingProgressIndicator = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const currentYear = getCurrentRamadanYear();

  const { data: profile } = useUserRamadanProfileQuery(
    user?.id,
    currentYear
  );

  if (!user || !profile) return null;

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
          {pagesReadToday} / {dailyGoalPages} {t('ramadan.progress.pages')}
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
          <p className="text-lg font-bold text-primary">{profile.challenges_completed}</p>
          <p className="text-xs text-textSecondary">{t('ramadan.progress.challengesDone')}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-primary">{profile.ramadan_streak}</p>
          <p className="text-xs text-textSecondary">{t('ramadan.progress.dayStreak')}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-primary">{profile.total_xp}</p>
          <p className="text-xs text-textSecondary">{t('ramadan.progress.xp')}</p>
        </div>
      </div>
    </motion.div>
  );
};
