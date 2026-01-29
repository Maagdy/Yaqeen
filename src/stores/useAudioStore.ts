import { create } from "zustand";

interface AudioHandlers {
  handleEnded: () => void;
  handleTimeUpdate: () => void;
  handlePause: () => void;
  handlePlay: () => void;
}

interface AudioElementWithHandlers extends HTMLAudioElement {
  _audioHandlers?: AudioHandlers;
}

interface AudioState {
  // Full Surah Player State
  fullSurahAudioUrl: string | null;
  fullSurahName: string | null;
  isPlayingFullSurah: boolean;
  fullSurahWasPaused: boolean; // Track if it was paused when ayah started

  // Ayah Player State
  currentAyahAudioUrl: string | null;
  currentAyahNumber: number | null;
  isPlayingAyah: boolean;

  // Shared Audio Element
  audioElement: HTMLAudioElement | null;
  currentTime: number;
  duration: number;
  isPlayerVisible: boolean;

  // Actions
  playFullSurah: (audioUrl: string, surahName: string) => void;
  playAyah: (audioUrl: string, ayahNumber: number) => void;
  togglePlay: () => void;
  stop: () => void;
  closePlayer: () => void;
  setAudioElement: (audio: HTMLAudioElement) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  // Initial state
  fullSurahAudioUrl: null,
  fullSurahName: null,
  isPlayingFullSurah: false,
  fullSurahWasPaused: false,
  currentAyahAudioUrl: null,
  currentAyahNumber: null,
  isPlayingAyah: false,
  audioElement: null,
  currentTime: 0,
  duration: 0,
  isPlayerVisible: false,

  // Play full surah
  playFullSurah: (audioUrl: string, surahName: string) => {
    const { audioElement, isPlayingAyah } = get();

    // Stop any playing ayah
    if (isPlayingAyah && audioElement) {
      audioElement.pause();
    }

    set({
      fullSurahAudioUrl: audioUrl,
      fullSurahName: surahName,
      isPlayingFullSurah: true,
      isPlayingAyah: false,
      currentAyahAudioUrl: null,
      currentAyahNumber: null,
      isPlayerVisible: true,
      fullSurahWasPaused: false,
    });

    if (audioElement) {
      audioElement.src = audioUrl;
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Play error:", error);
          }
        });
      }
    }
  },

  // Play individual ayah
  playAyah: (audioUrl: string, ayahNumber: number) => {
    const { audioElement, isPlayingFullSurah } = get();

    // Pause full surah if playing (but remember it was playing)
    if (isPlayingFullSurah && audioElement) {
      audioElement.pause();
      set({ fullSurahWasPaused: true });
    }

    set({
      currentAyahAudioUrl: audioUrl,
      currentAyahNumber: ayahNumber,
      isPlayingAyah: true,
      isPlayingFullSurah: false,
      isPlayerVisible: true,
    });

    if (audioElement) {
      audioElement.src = audioUrl;
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Play error:", error);
          }
        });
      }
    }
  },

  // Toggle play/pause
  togglePlay: () => {
    const { audioElement, isPlayingFullSurah, isPlayingAyah } = get();

    if (!audioElement) return;

    if (isPlayingFullSurah || isPlayingAyah) {
      audioElement.pause();
      set({ isPlayingFullSurah: false, isPlayingAyah: false });
    } else {
      audioElement.play();
      const { fullSurahAudioUrl, currentAyahAudioUrl } = get();
      if (fullSurahAudioUrl) {
        set({ isPlayingFullSurah: true });
      } else if (currentAyahAudioUrl) {
        set({ isPlayingAyah: true });
      }
    }
  },

  // Stop playback
  stop: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    set({
      isPlayingFullSurah: false,
      isPlayingAyah: false,
      fullSurahWasPaused: false,
    });
  },

  // Close player
  closePlayer: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    set({
      isPlayerVisible: false,
      isPlayingFullSurah: false,
      isPlayingAyah: false,
      fullSurahAudioUrl: null,
      fullSurahName: null,
      currentAyahAudioUrl: null,
      currentAyahNumber: null,
      currentTime: 0,
      duration: 0,
      fullSurahWasPaused: false,
    });
  },

  // Set audio element reference
  setAudioElement: (audio: HTMLAudioElement) => {
    const state = get();
    const currentAudio = state.audioElement as AudioElementWithHandlers | null;

    // Store handlers in a more accessible way
    const handlers = currentAudio?._audioHandlers;

    // Remove old event listeners if audio element already exists
    if (currentAudio && handlers) {
      currentAudio.removeEventListener("ended", handlers.handleEnded);
      currentAudio.removeEventListener("timeupdate", handlers.handleTimeUpdate);
      currentAudio.removeEventListener("pause", handlers.handlePause);
      currentAudio.removeEventListener("play", handlers.handlePlay);
    }

    set({ audioElement: audio });

    // Handle when audio ends
    const handleEnded = () => {
      const {
        isPlayingAyah,
        fullSurahWasPaused,
        fullSurahAudioUrl,
        audioElement,
      } = get();

      // If an ayah just finished and full surah was playing before
      if (
        isPlayingAyah &&
        fullSurahWasPaused &&
        fullSurahAudioUrl &&
        audioElement
      ) {
        // Resume full surah
        set({
          isPlayingAyah: false,
          currentAyahAudioUrl: null,
          currentAyahNumber: null,
          isPlayingFullSurah: true,
          fullSurahWasPaused: false,
        });
        audioElement.src = fullSurahAudioUrl;
        audioElement.play();
      } else {
        // Just stop
        set({
          isPlayingFullSurah: false,
          isPlayingAyah: false,
          fullSurahWasPaused: false,
        });
      }
    };

    const handleTimeUpdate = () => {
      set({
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      });
    };

    const handlePause = () => {
      set({ isPlayingFullSurah: false, isPlayingAyah: false });
    };

    const handlePlay = () => {
      const { fullSurahAudioUrl, currentAyahAudioUrl } = get();
      if (fullSurahAudioUrl && audio.src.includes(fullSurahAudioUrl)) {
        set({ isPlayingFullSurah: true, isPlayingAyah: false });
      } else if (currentAyahAudioUrl) {
        set({ isPlayingAyah: true, isPlayingFullSurah: false });
      }
    };

    // Store handlers on the audio element for later cleanup
    (audio as AudioElementWithHandlers)._audioHandlers = {
      handleEnded,
      handleTimeUpdate,
      handlePause,
      handlePlay,
    };

    // Add event listeners
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
  },
}));
