import React, { useState, useRef, useEffect, useCallback } from "react";
import type { AudioContextType, PlaybackType } from "../contexts/audio-context.types";
import { AudioContext } from "../contexts/audio-context";

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

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
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
