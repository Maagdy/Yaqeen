import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAudioStore } from "../../../stores/useAudioStore";

export const GlobalAudioPlayer = () => {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    fullSurahName,
    currentAyahNumber,
    isPlayingFullSurah,
    isPlayingAyah,
    isPlayerVisible,
    currentTime,
    duration,
    togglePlay,
    closePlayer,
    setAudioElement,
  } = useAudioStore();

  // Register audio element with store
  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, [setAudioElement]);

  if (!isPlayerVisible) return null;

  const isPlaying = isPlayingFullSurah || isPlayingAyah;
  const displayText = isPlayingFullSurah
    ? fullSurahName || "Full Surah"
    : `Ayah ${currentAyahNumber}`;

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Fixed bottom player */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-primary/20 shadow-lg animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Top row: Info and close button */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🕌</span>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {displayText}
                </p>
                <p className="text-xs text-text-secondary">
                  {isPlaying ? t("audio.playing") : t("audio.paused")}
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={closePlayer}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors"
              aria-label={t("audio.close")}
            >
              <svg
                className="w-5 h-5 text-text-secondary hover:text-text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Bottom row: Controls and progress */}
          <div className="flex items-center gap-4">
            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              className="p-3 bg-primary-600 hover:bg-primary-700 rounded-full transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* Progress bar and time */}
            <div className="flex-1 flex items-center gap-3">
              <span className="text-xs text-text-secondary min-w-10">
                {formatTime(currentTime)}
              </span>

              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />

              <span className="text-xs text-text-secondary min-w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
