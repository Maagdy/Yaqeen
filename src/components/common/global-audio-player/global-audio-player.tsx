// src/components/global-audio-player/global-audio-player.tsx
import React, { useRef, useState, useEffect, useCallback } from "react";

import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Close,
  VolumeUp,
  VolumeOff,
} from "@mui/icons-material";
import { useSurahNavigation } from "../../../hooks/useSurahNavigation";
import { useAudio } from "../../../hooks/useAudio";
import { useTranslation } from "react-i18next";

export const GlobalAudioPlayer: React.FC = () => {
  const {
    isPlaying,
    currentAudio,
    progress,
    duration,
    volume,
    toggle,
    seek,
    setVolume,
    stop,
  } = useAudio();
  const { t } = useTranslation();
  const { onNext, onPrevious, canGoNext, canGoPrevious } = useSurahNavigation();
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const updateProgress = useCallback(
    (clientX: number) => {
      if (!progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percentage * duration;
      seek(newTime);
    },
    [duration, seek],
  );

  const updateVolume = useCallback(
    (clientX: number) => {
      if (!volumeRef.current) return;
      const rect = volumeRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      setVolume(percentage);
    },
    [setVolume],
  );

  // Progress handlers
  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingProgress(true);
    updateProgress(e.clientX);
  };

  const handleProgressTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDraggingProgress(true);
    updateProgress(e.touches[0].clientX);
  };

  // Volume handlers
  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingVolume(true);
    updateVolume(e.clientX);
  };

  const handleVolumeTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDraggingVolume(true);
    updateVolume(e.touches[0].clientX);
  };

  // Global mouse/touch move and up handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingProgress) {
        updateProgress(e.clientX);
      } else if (isDraggingVolume) {
        updateVolume(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingProgress) {
        updateProgress(e.touches[0].clientX);
      } else if (isDraggingVolume) {
        updateVolume(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingProgress(false);
      setIsDraggingVolume(false);
    };

    const handleTouchEnd = () => {
      setIsDraggingProgress(false);
      setIsDraggingVolume(false);
    };

    if (isDraggingProgress || isDraggingVolume) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDraggingProgress, isDraggingVolume, updateProgress, updateVolume]);

  // Check if audio is live stream (infinite duration)
  const isLive = !Number.isFinite(duration) || duration === Infinity;

  // Calculate progress percentage
  // For live streams, we can't calculate percentage, so show 100% or 0%
  const progressPercentage = isLive
    ? 100
    : duration > 0
      ? (progress / duration) * 100
      : 0;
  const volumePercentage = volume * 100;

  // Early return AFTER all hooks
  if (!currentAudio) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-background dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-50"
      dir="ltr"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-xs text-text-secondary min-w-8 sm:min-w-10">
            {isLive ? t("radio.live") : formatTime(progress)}
          </span>
          <div
            ref={progressRef}
            className={`flex-1 relative h-4 flex items-center select-none ${isLive ? "cursor-default" : "cursor-pointer"}`}
            onMouseDown={isLive ? undefined : handleProgressMouseDown}
            onTouchStart={isLive ? undefined : handleProgressTouchStart}
          >
            {/* Background track */}
            <div className="absolute inset-0 h-1 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {/* Played portion (colored) */}
              <div
                className={`h-full bg-primary transition-all duration-100 ${isLive ? "animate-pulse" : ""}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {/* Thumb (ball) - Hide for live streams */}
            {!isLive && (
              <div
                className="absolute w-3 h-3 bg-primary rounded-full shadow-md transition-all duration-100 cursor-grab active:cursor-grabbing -translate-x-1/2"
                style={{ left: `${progressPercentage}%` }}
              />
            )}
          </div>
          <span className="text-[10px] sm:text-xs text-text-secondary min-w-8 sm:min-w-10 text-right">
            {isLive ? t("radio.live") : formatTime(duration)}
          </span>
        </div>

        {/* Controls Section */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Volume Control - Left Side */}
          <div className="flex items-center gap-2 min-w-20 lg:min-w-24">
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 1)}
              className="text-text-secondary hover:text-primary transition-colors shrink-0"
              aria-label={volume > 0 ? "Mute" : "Unmute"}
            >
              {volume > 0 ? (
                <VolumeUp fontSize="small" />
              ) : (
                <VolumeOff fontSize="small" />
              )}
            </button>
            <div
              ref={volumeRef}
              className="flex-1 relative h-4 flex items-center cursor-pointer select-none"
              onMouseDown={handleVolumeMouseDown}
              onTouchStart={handleVolumeTouchStart}
            >
              {/* Background track */}
              <div className="absolute inset-0 h-1 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                {/* Volume level (colored) */}
                <div
                  className="h-full bg-primary transition-all duration-100"
                  style={{ width: `${volumePercentage}%` }}
                />
              </div>
              {/* Thumb (ball) */}
              <div
                className="absolute w-3 h-3 bg-primary rounded-full shadow-md transition-all duration-100 cursor-grab active:cursor-grabbing -translate-x-1/2"
                style={{ left: `${volumePercentage}%` }}
              />
            </div>
          </div>

          {/* Playback Controls - Center */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Previous Button */}
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious || !onPrevious}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-secondary"
              aria-label="Previous Surah"
            >
              <SkipPrevious fontSize="small" className="sm:text-base" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={toggle}
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-primary hover:bg-primary/80 text-white transition-colors shadow-md"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause fontSize="medium" className="sm:text-3xl" />
              ) : (
                <PlayArrow fontSize="medium" className="sm:text-3xl" />
              )}
            </button>

            {/* Next Button */}
            <button
              onClick={onNext}
              disabled={!canGoNext || !onNext}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-secondary"
              aria-label="Next Surah"
            >
              <SkipNext fontSize="small" className="sm:text-base" />
            </button>
          </div>

          {/* Close Button - Right Side */}
          <div className="min-w-8 sm:min-w-10 lg:min-w-12 flex justify-end">
            <button
              onClick={stop}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close player"
            >
              <Close fontSize="small" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
