import React, { useState, useRef, useEffect, useCallback } from "react";
import type { AudioContextType, PlaybackType } from "../contexts/audio-context.types";
import { AudioContext } from "../contexts/audio-context";
import { useRamadanTracking } from '@/hooks/useRamadanTracking';
import { shouldTrackListening, secondsToMinutes } from '@/utils/quran-tracking-utils';

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number | null>(
    null,
  );
  const [playbackType, setPlaybackType] = useState<PlaybackType>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [listenedAudioTracked, setListenedAudioTracked] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ramadan challenge tracking
  const { trackMinutesListened, isLoggedIn } = useRamadanTracking();

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    // Event listeners
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = async () => {
      setIsPlaying(false);
      setProgress(0);

      // Only track if not already tracked via pause
      if (!listenedAudioTracked && isLoggedIn && audioRef.current) {
        const duration = audioRef.current.duration;

        if (shouldTrackListening(playbackType) && duration > 0) {
          const minutes = secondsToMinutes(duration);
          if (minutes > 0) {
            try {
              await trackMinutesListened(minutes, false);
              setListenedAudioTracked(true);
            } catch (error) {
              console.error('[Audio Tracker] Failed to track listening:', error);
            }
          }
        }
      }
    };

    const handleError = () => {
      console.error("Audio error");
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, []);

  // Helper function to track partial listening (>80% completion)
  const trackPartialListening = async () => {
    if (isLoggedIn && audioRef.current && !listenedAudioTracked) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;

      // Track if user listened to >80% of audio
      if (duration > 0 && currentTime / duration > 0.8) {
        const minutes = secondsToMinutes(currentTime);
        if (minutes > 0 && shouldTrackListening(playbackType)) {
          try {
            await trackMinutesListened(minutes, false);
            setListenedAudioTracked(true); // Prevent double-tracking
          } catch (error) {
            console.error('[Audio Tracker] Failed to track partial listening:', error);
          }
        }
      }
    }
  };

  const play = useCallback(
    (audioUrl: string, surahNumber?: number, type: PlaybackType = 'surah') => {
      if (!audioRef.current) return;

      if (currentAudio === audioUrl) {
        audioRef.current.play();
        setIsPlaying(true);
        return;
      }

      audioRef.current.src = audioUrl;
      audioRef.current.volume = volume;
      setCurrentAudio(audioUrl);
      setCurrentSurahNumber(surahNumber ?? null);
      setPlaybackType(type);
      setListenedAudioTracked(false); // Reset tracking flag for new audio

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
    },
    [currentAudio, volume],
  );

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    // Track partial listening if user listened to most of it
    trackPartialListening();
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else if (currentAudio) {
      play(currentAudio, currentSurahNumber ?? undefined, playbackType ?? 'surah');
    }
  }, [isPlaying, currentAudio, currentSurahNumber, playbackType, play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentAudio(null);
    setCurrentSurahNumber(null);
    setPlaybackType(null);
    setProgress(0);
  }, []);

  const value: AudioContextType = {
    isPlaying,
    currentAudio,
    currentSurahNumber,
    playbackType,
    progress,
    duration,
    volume,
    play,
    pause,
    toggle,
    seek,
    setVolume,
    stop,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};
