import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme, Language, AudioSettings } from "../types";

interface PreferencesState {
  theme: Theme;
  language: Language;
  audioSettings: AudioSettings;
  selectedReciterId: number | null;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setAudioSettings: (settings: Partial<AudioSettings>) => void;
  setSelectedReciterId: (id: number | null) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "light",
      language: "ar",
      audioSettings: {
        volume: 1,
        autoplay: false,
      },
      selectedReciterId: null,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setAudioSettings: (settings) =>
        set((state) => ({
          audioSettings: { ...state.audioSettings, ...settings },
        })),
      setSelectedReciterId: (id) => set({ selectedReciterId: id }),
    }),
    {
      name: "Yaqeen-preferences",
    },
  ),
);
